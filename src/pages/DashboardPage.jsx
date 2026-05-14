import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import './DashboardPage.css';

import { TRADING_DATA_STORAGE_KEY } from '../constants/storageKeys';
import { PROFILE_TYPE_LABELS } from '../investorTest/constants';
import { loadInvestorTestResult } from '../investorTest/persistence';
import { loadCanonicalPrinciples } from '../principles/storage';
import { validateTradeAgainstCanonicalPrinciples } from '../principles/tradePrincipleValidator';
import MentorQuoteHero from './components/MentorQuoteHero';

function loadTradingData() {
  try {
    const raw = localStorage.getItem(TRADING_DATA_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveTradingData(list) {
  localStorage.setItem(TRADING_DATA_STORAGE_KEY, JSON.stringify(list));
}

/** @typedef {{ name: string, entry: number, target: number, stop: number, editingId: number | null }} TradePayload */

export default function DashboardPage() {
  const [items, setItems] = useState(loadTradingData);
  const [editingId, setEditingId] = useState(null);
  const testResult = loadInvestorTestResult();
  const profileStripLabel = testResult?.profileType
    ? PROFILE_TYPE_LABELS[testResult.profileType]
    : '—';
  const [form, setForm] = useState({
    name: '',
    entry: '',
    target: '',
    stop: '',
  });
  const [principleModal, setPrincipleModal] = useState(null);
  const [pendingTradePayload, setPendingTradePayload] = useState(null);

  /** @type {[null | { kind: 'exit'; id: number } | { kind: 'memo'; id: number; exitType: 'profit' | 'loss' } | { kind: 'delete'; id: number } | { kind: 'fomo'; payload: TradePayload; bypassPrincipleCheck: boolean } | { kind: 'notice'; message: string }, function]} */
  const [uiModal, setUiModal] = useState(null);
  const [memoDraft, setMemoDraft] = useState('');
  const [saveBanner, setSaveBanner] = useState('');
  const saveBannerTimer = useRef(null);

  useEffect(() => {
    saveTradingData(items);
  }, [items]);

  useEffect(() => {
    return () => {
      if (saveBannerTimer.current) window.clearTimeout(saveBannerTimer.current);
    };
  }, []);

  const showSaveBanner = useCallback((msg) => {
    setSaveBanner(msg);
    if (saveBannerTimer.current) window.clearTimeout(saveBannerTimer.current);
    saveBannerTimer.current = window.setTimeout(() => setSaveBanner(''), 2600);
  }, []);

  const resetForm = useCallback(() => {
    setForm({ name: '', entry: '', target: '', stop: '' });
    setEditingId(null);
  }, []);

  const openCompleteExit = useCallback((id) => {
    setUiModal({ kind: 'exit', id });
  }, []);

  const openMemoStep = useCallback((id, exitType) => {
    setMemoDraft('');
    setUiModal({ kind: 'memo', id, exitType });
  }, []);

  const applyCompleteWithMemo = useCallback(() => {
    if (!uiModal || uiModal.kind !== 'memo') return;
    const { id, exitType } = uiModal;
    const memo = memoDraft.trim();
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: 'completed', exitType, memo: memo || undefined } : item
      )
    );
    setUiModal(null);
    setMemoDraft('');
  }, [uiModal, memoDraft]);

  const skipMemoAndComplete = useCallback(() => {
    if (!uiModal || uiModal.kind !== 'memo') return;
    const { id, exitType } = uiModal;
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: 'completed', exitType, memo: undefined } : item
      )
    );
    setUiModal(null);
    setMemoDraft('');
  }, [uiModal]);

  const startEdit = useCallback((id) => {
    const item = items.find((i) => i.id === id);
    if (!item || item.status === 'completed') return;
    setForm({
      name: item.name,
      entry: String(item.entry),
      target: String(item.target),
      stop: String(item.stop),
    });
    setEditingId(id);
  }, [items]);

  const confirmDelete = useCallback(() => {
    if (!uiModal || uiModal.kind !== 'delete') return;
    const { id } = uiModal;
    setItems((prev) => prev.filter((item) => item.id !== id));
    if (editingId === id) resetForm();
    setUiModal(null);
  }, [uiModal, editingId, resetForm]);

  const finalizeSave = useCallback(
    (/** @type {TradePayload} */ payload, { bypassPrincipleCheck = false, bypassFomo = false } = {}) => {
      const { name, entry, target, stop, editingId: editId } = payload;

      if (!bypassPrincipleCheck) {
        const canonical = loadCanonicalPrinciples();
        const check = validateTradeAgainstCanonicalPrinciples({
          entry,
          target,
          stop,
          canonical,
        });
        if (!check.ok) {
          setPrincipleModal({
            violations: check.violations,
            profileLabel: check.profileLabel,
          });
          setPendingTradePayload(payload);
          return;
        }
      }

      if (!bypassFomo && editId !== null) {
        const originalItem = items.find((item) => item.id === editId);
        if (originalItem && stop < originalItem.stop) {
          setUiModal({ kind: 'fomo', payload, bypassPrincipleCheck });
          return;
        }
      }

      if (editId !== null) {
        setItems((prev) =>
          prev.map((item) =>
            item.id === editId ? { ...item, name, entry, target, stop } : item
          )
        );
        showSaveBanner('수정 내용이 저장되었습니다.');
      } else {
        setItems((prev) => [
          ...prev,
          {
            id: Date.now(),
            name,
            entry,
            target,
            stop,
            status: 'active',
          },
        ]);
        showSaveBanner('기록이 추가되었습니다.');
      }

      setPrincipleModal(null);
      setPendingTradePayload(null);
      resetForm();
    },
    [items, resetForm, showSaveBanner]
  );

  const handleSave = useCallback(() => {
    const name = form.name.trim();
    const entry = Number(form.entry);
    const target = Number(form.target);
    const stop = Number(form.stop);

    if (!name || entry <= 0 || target <= 0 || stop <= 0) {
      setUiModal({ kind: 'notice', message: '모든 항목을 올바른 숫자로 입력해주세요.' });
      return;
    }
    if (target <= entry) {
      setUiModal({ kind: 'notice', message: '익절가는 진입가보다 높아야 합니다.' });
      return;
    }
    if (stop >= entry) {
      setUiModal({ kind: 'notice', message: '손절가는 진입가보다 낮아야 합니다.' });
      return;
    }

    finalizeSave(
      { name, entry, target, stop, editingId },
      { bypassPrincipleCheck: false }
    );
  }, [editingId, form, finalizeSave]);

  const closePrincipleModal = useCallback(() => {
    setPrincipleModal(null);
    setPendingTradePayload(null);
  }, []);

  const confirmPrincipleExceptionSave = useCallback(() => {
    if (!pendingTradePayload) return;
    finalizeSave(pendingTradePayload, { bypassPrincipleCheck: true });
  }, [pendingTradePayload, finalizeSave]);

  const confirmFomo = useCallback(() => {
    if (!uiModal || uiModal.kind !== 'fomo') return;
    const { payload, bypassPrincipleCheck } = uiModal;
    setUiModal(null);
    finalizeSave(payload, { bypassPrincipleCheck, bypassFomo: true });
  }, [uiModal, finalizeSave]);

  const activeItems = items.filter((item) => item.status !== 'completed');
  const completedItems = items.filter((item) => item.status === 'completed');

  return (
    <div className="dashboard-page">
      {principleModal && (
        <div
          className="app-modal-backdrop"
          role="presentation"
          onClick={closePrincipleModal}
        >
          <div
            className="app-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="principle-modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="principle-modal-title" className="app-modal__title">
              원칙 점검 알림
            </h2>
            <p className="app-modal__lead">
              방금 입력한 진입가·익절가·손절가가, AI 투자 원칙 페이지에서 확정 저장한{' '}
              <strong>익절·손절 원칙 카드</strong>에 적힌 비율(%)을 기준으로 볼 때 어긋납니다.
              카드 문구를 직접 수정했다면 그 내용이 그대로 반영됩니다. 스멘은 규칙을 지키는 쪽을 권합니다.
            </p>
            <ul className="app-modal__list">
              {principleModal.violations.map((v) => (
                <li key={v.code}>{v.message}</li>
              ))}
            </ul>
            <div className="app-modal__actions">
              <button type="button" className="app-modal__btn app-modal__btn--primary" onClick={closePrincipleModal}>
                가격 다시 조정
              </button>
              <button
                type="button"
                className="app-modal__btn app-modal__btn--soft"
                onClick={confirmPrincipleExceptionSave}
              >
                원칙 예외로 저장
              </button>
            </div>
          </div>
        </div>
      )}

      {uiModal?.kind === 'exit' && (
        <div className="app-modal-backdrop" role="presentation" onClick={() => setUiModal(null)}>
          <div
            className="app-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="dash-exit-title"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="dash-exit-title" className="app-modal__title">
              매매 종료
            </h2>
            <p className="app-modal__lead">어떤 방식으로 종료하셨나요? 선택 후 복기 메모를 적을 수 있어요.</p>
            <div className="app-modal__actions app-modal__actions--row">
              <button
                type="button"
                className="app-modal__btn app-modal__btn--primary"
                onClick={() => openMemoStep(uiModal.id, 'profit')}
              >
                익절로 종료
              </button>
              <button
                type="button"
                className="app-modal__btn app-modal__btn--outline"
                onClick={() => openMemoStep(uiModal.id, 'loss')}
              >
                손절로 종료
              </button>
            </div>
          </div>
        </div>
      )}

      {uiModal?.kind === 'memo' && (
        <div className="app-modal-backdrop" role="presentation">
          <div
            className="app-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="dash-memo-title"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="dash-memo-title" className="app-modal__title">
              매매 복기
            </h2>
            <p className="app-modal__lead">
              감정 상태, 원칙 준수 여부 등을 간단히 적어 두면 이후 리포트·복기에 도움이 됩니다.
            </p>
            <label className="dashboard-page__memo-label" htmlFor="dash-memo-input">
              메모
            </label>
            <textarea
              id="dash-memo-input"
              className="app-input dashboard-page__memo-input"
              rows={4}
              value={memoDraft}
              onChange={(e) => setMemoDraft(e.target.value)}
              placeholder="예: 계획대로 익절했는지, 욕심은 없었는지…"
            />
            <div className="app-modal__actions app-modal__actions--row">
              <button type="button" className="app-modal__btn app-modal__btn--outline" onClick={skipMemoAndComplete}>
                건너뛰기
              </button>
              <button type="button" className="app-modal__btn app-modal__btn--primary" onClick={applyCompleteWithMemo}>
                저장하고 종료
              </button>
            </div>
          </div>
        </div>
      )}

      {uiModal?.kind === 'delete' && (
        <div className="app-modal-backdrop" role="presentation" onClick={() => setUiModal(null)}>
          <div
            className="app-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="dash-del-title"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="dash-del-title" className="app-modal__title">
              기록 삭제
            </h2>
            <p className="app-modal__lead">정말 삭제하시겠습니까? 기록이 영구히 지워집니다.</p>
            <div className="app-modal__actions app-modal__actions--row">
              <button type="button" className="app-modal__btn app-modal__btn--outline" onClick={() => setUiModal(null)}>
                취소
              </button>
              <button type="button" className="app-modal__btn app-modal__btn--danger" onClick={confirmDelete}>
                삭제하기
              </button>
            </div>
          </div>
        </div>
      )}

      {uiModal?.kind === 'fomo' && (
        <div className="app-modal-backdrop" role="presentation" onClick={() => setUiModal(null)}>
          <div
            className="app-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="dash-fomo-title"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="dash-fomo-title" className="app-modal__title">
              FOMO 점검
            </h2>
            <p className="app-modal__lead">
              기존 손절가보다 기준을 낮추려고 합니다. 원칙을 깨는 감정적인 결정이 아닌지 한 번 더 확인해 주세요.
            </p>
            <div className="app-modal__actions app-modal__actions--row">
              <button type="button" className="app-modal__btn app-modal__btn--outline" onClick={() => setUiModal(null)}>
                돌아가서 조정
              </button>
              <button type="button" className="app-modal__btn app-modal__btn--primary" onClick={confirmFomo}>
                그래도 저장
              </button>
            </div>
          </div>
        </div>
      )}

      {uiModal?.kind === 'notice' && (
        <div className="app-modal-backdrop" role="presentation" onClick={() => setUiModal(null)}>
          <div
            className="app-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="dash-notice-title"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="dash-notice-title" className="app-modal__title">
              입력 확인
            </h2>
            <p className="app-modal__lead">{uiModal.message}</p>
            <div className="app-modal__actions">
              <button type="button" className="app-modal__btn app-modal__btn--primary" onClick={() => setUiModal(null)}>
                확인
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="container">
        <aside className="app-strip" aria-label="연결된 여정 데이터">
          <span>
            성향 테스트: <strong>{profileStripLabel}</strong>
          </span>
          <span className="app-strip__sep">·</span>
          <Link to="/principles">원칙 수정</Link>
          <Link to="/report">투자 리포트</Link>
        </aside>

        <MentorQuoteHero />

        <h1>트레이딩 기록장</h1>

        {saveBanner ? (
          <p className="dashboard-page__save-banner" role="status">
            {saveBanner}
          </p>
        ) : null}

        <div className="input-section">
          <input
            className="app-input"
            type="text"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="종목명 (예: 삼성전자)"
          />
          <input
            className="app-input"
            type="number"
            value={form.entry}
            onChange={(e) => setForm((f) => ({ ...f, entry: e.target.value }))}
            placeholder="진입가"
          />
          <input
            className="app-input"
            type="number"
            value={form.target}
            onChange={(e) => setForm((f) => ({ ...f, target: e.target.value }))}
            placeholder="익절가"
          />
          <input
            className="app-input"
            type="number"
            value={form.stop}
            onChange={(e) => setForm((f) => ({ ...f, stop: e.target.value }))}
            placeholder="손절가"
          />
          <div className="button-group dashboard-page__tabs-like">
            <button type="button" className="app-btn-primary" onClick={handleSave}>
              {editingId !== null ? '수정 완료' : '기록하기'}
            </button>
            {editingId !== null && (
              <button type="button" className="app-btn-secondary" onClick={resetForm}>
                취소
              </button>
            )}
          </div>
        </div>

        <h2>진행 중인 매매</h2>
        <table className="data-table">
          <thead>
            <tr>
              <th>종목명</th>
              <th>진입가</th>
              <th>익절/손절가 (예상 수익/손실)</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            {activeItems.map((item) => {
              const profitPercent = (((item.target - item.entry) / item.entry) * 100).toFixed(2);
              const lossPercent = (((item.entry - item.stop) / item.entry) * 100).toFixed(2);
              return (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.entry.toLocaleString()}원</td>
                  <td className="targets-cell">
                    📈 {item.target.toLocaleString()}원{' '}
                    <span className="profit-tag">(+{profitPercent}%)</span>
                    <br />
                    📉 {item.stop.toLocaleString()}원{' '}
                    <span className="loss-tag">(-{lossPercent}%)</span>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="dashboard-pill dashboard-pill--accent"
                      onClick={() => openCompleteExit(item.id)}
                    >
                      매매종료
                    </button>
                    <br />
                    <button
                      type="button"
                      className="dashboard-pill"
                      onClick={() => startEdit(item.id)}
                    >
                      수정
                    </button>
                    <button
                      type="button"
                      className="dashboard-pill dashboard-pill--danger"
                      onClick={() => setUiModal({ kind: 'delete', id: item.id })}
                    >
                      삭제
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <h2 className="note-title">📝 오답 노트 (원칙 복기)</h2>
        <table className="data-table note-table">
          <thead>
            <tr>
              <th>종목명</th>
              <th>진입가</th>
              <th>종료 상태</th>
              <th>복기 메모</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            {completedItems.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.entry.toLocaleString()}원</td>
                <td>{item.exitType === 'profit' ? '익절 (+)' : '손절 (-)'}</td>
                <td className="memo-text">{item.memo || '메모 없음'}</td>
                <td>
                  <button
                    type="button"
                    className="dashboard-pill dashboard-pill--danger"
                    onClick={() => setUiModal({ kind: 'delete', id: item.id })}
                  >
                    영구삭제
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
