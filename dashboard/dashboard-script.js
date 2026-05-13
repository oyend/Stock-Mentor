const saveBtn = document.getElementById('saveBtn');
const cancelBtn = document.getElementById('cancelBtn');
const listBody = document.getElementById('listBody');
const noteBody = document.getElementById('noteBody'); // 오답 노트 바디 추가

const nameInput = document.getElementById('itemName');
const entryInput = document.getElementById('entryPrice');
const targetInput = document.getElementById('targetPrice');
const stopInput = document.getElementById('stopLoss');

let editingId = null;

function renderList() {
    const dataList = JSON.parse(localStorage.getItem('tradingData') || '[]');
    listBody.innerHTML = ''; 
    noteBody.innerHTML = ''; 

    dataList.forEach(item => {
        // [1안 기능] 수익률/손실률 계산 (기존 로직 유지)
        const profitPercent = (((item.target - item.entry) / item.entry) * 100).toFixed(2);
        const lossPercent = (((item.entry - item.stop) / item.entry) * 100).toFixed(2);

        const row = document.createElement('tr');

        // 상태가 'completed'인 경우 오답 노트 렌더링
        if (item.status === 'completed') {
            row.innerHTML = `
                <td>${item.name}</td>
                <td>${item.entry.toLocaleString()}원</td>
                <td>${item.exitType === 'profit' ? '익절 (+)' : '손절 (-)'}</td>
                <td class="memo-text">${item.memo || '메모 없음'}</td>
                <td>
                    <button class="action-btn btn-delete" onclick="deleteItem(${item.id})">영구삭제</button>
                </td>
            `;
            noteBody.appendChild(row);
        } 
        // 상태가 'active'이거나 없는 경우 (기본) 진행 중 렌더링
        else {
            row.innerHTML = `
                <td>${item.name}</td>
                <td>${item.entry.toLocaleString()}원</td>
                <td>
                    📈 ${item.target.toLocaleString()}원 <span style="color:#ef4444; font-size:12px;">(+${profitPercent}%)</span><br>
                    📉 ${item.stop.toLocaleString()}원 <span style="color:#3b82f6; font-size:12px;">(-${lossPercent}%)</span>
                </td>
                <td>
                    <button class="action-btn btn-complete" onclick="completeItem(${item.id})">매매종료</button><br>
                    <button class="action-btn btn-edit" onclick="startEdit(${item.id})">수정</button>
                    <button class="action-btn btn-delete" onclick="deleteItem(${item.id})">삭제</button>
                </td>
            `;
            listBody.appendChild(row);
        }
    });
}

// [2안 기능] 매매 종료 처리 및 오답 노트 기록
window.completeItem = function(id) {
    let dataList = JSON.parse(localStorage.getItem('tradingData') || '[]');
    const itemIndex = dataList.findIndex(item => item.id === id);

    if (itemIndex > -1) {
        const exitType = confirm('익절로 마무리하셨나요? (확인: 익절 / 취소: 손절)') ? 'profit' : 'loss';
        const memo = prompt('매매 복기(감정 상태, 원칙 준수 여부 등)를 간단히 적어주세요:');
        
        dataList[itemIndex].status = 'completed';
        dataList[itemIndex].exitType = exitType;
        dataList[itemIndex].memo = memo;
        
        localStorage.setItem('tradingData', JSON.stringify(dataList));
        renderList();
    }
}

window.startEdit = function(id) {
    const dataList = JSON.parse(localStorage.getItem('tradingData') || '[]');
    const itemToEdit = dataList.find(item => item.id === id);

    if (itemToEdit) {
        nameInput.value = itemToEdit.name;
        entryInput.value = itemToEdit.entry;
        targetInput.value = itemToEdit.target;
        stopInput.value = itemToEdit.stop;

        editingId = id;
        saveBtn.textContent = '수정 완료';
        saveBtn.classList.add('edit-mode');
        cancelBtn.style.display = 'block'; 
    }
}

function resetForm() {
    nameInput.value = '';
    entryInput.value = '';
    targetInput.value = '';
    stopInput.value = '';
    
    editingId = null;
    saveBtn.textContent = '기록하기';
    saveBtn.classList.remove('edit-mode');
    cancelBtn.style.display = 'none';
}

cancelBtn.addEventListener('click', resetForm);

window.deleteItem = function(id) {
    if(confirm('정말 삭제하시겠습니까? 기록이 영구히 지워집니다.')) {
        let dataList = JSON.parse(localStorage.getItem('tradingData') || '[]');
        dataList = dataList.filter(item => item.id !== id);
        localStorage.setItem('tradingData', JSON.stringify(dataList));
        
        if (editingId === id) resetForm(); 
        renderList();
    }
}

saveBtn.addEventListener('click', () => {
    const entry = Number(entryInput.value);
    const target = Number(targetInput.value);
    const stop = Number(stopInput.value);

    if (!nameInput.value || entry <= 0 || target <= 0 || stop <= 0) {
        alert('모든 항목을 올바른 숫자로 입력해주세요.');
        return;
    }
    if (target <= entry) {
        alert('익절가는 진입가보다 높아야 합니다!');
        return;
    }
    if (stop >= entry) {
        alert('손절가는 진입가보다 낮아야 합니다!');
        return;
    }

    let dataList = JSON.parse(localStorage.getItem('tradingData') || '[]');

    if (editingId !== null) {
        // [3안 기능] FOMO 및 감정적 수정 방지 넛지(Nudge)
        const originalItem = dataList.find(item => item.id === editingId);
        
        // 기존 손절가보다 더 낮은 가격(손실을 더 키우는 방향)으로 수정하려는 경우
        if (originalItem && stop < originalItem.stop) {
            const isConfirmed = confirm("⚠️ [FOMO 경고]\n기존 손절가보다 기준을 낮추려고 합니다.\n원칙을 깨는 감정적인 결정이 아닌지 다시 한번 생각해 보세요.\n정말 수정하시겠습니까?");
            if (!isConfirmed) {
                return; // 사용자가 취소하면 수정 중단
            }
        }

        dataList = dataList.map(item => {
            if (item.id === editingId) {
                return { ...item, name: nameInput.value, entry, target, stop };
            }
            return item;
        });
        alert('수정되었습니다!');
    } else {
        const newData = {
            id: Date.now(),
            name: nameInput.value,
            entry, target, stop,
            status: 'active' // 새로 기록할 때는 active 상태로 저장
        };
        dataList.push(newData);
    }

    localStorage.setItem('tradingData', JSON.stringify(dataList));
    renderList();
    resetForm();
});

// 초기 렌더링
renderList();