const beepSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3');

let state = {
    step: 'init_scan', 
    hasCP: false,
    startTime: "--:--",
    seconds: 0,
    timerInterval: null
};

// Hàm định dạng thời gian HH:MM:SS
function formatTimer(totalSeconds) {
    const h = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
    const s = (totalSeconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
}

// Bắt đầu đồng hồ đếm giây nhảy giả định
function startLiveTimer() {
    if (state.timerInterval) clearInterval(state.timerInterval);
    state.timerInterval = setInterval(() => {
        state.seconds++;
        const timerEl = document.getElementById('live-timer');
        if (timerEl) timerEl.innerText = formatTimer(state.seconds);
    }, 1000);
}

// Giả lập quét mã QR
function triggerScan(target) {
    const screen = document.getElementById('scanner-screen');
    const check = document.getElementById('check-icon');
    screen.classList.remove('hidden');
    check.classList.add('hidden');

    setTimeout(() => {
        check.classList.remove('hidden');
        beepSound.play();
        if (navigator.vibrate) navigator.vibrate(200);

        setTimeout(() => {
            screen.classList.add('hidden');
            updateState(target);
        }, 800);
    }, 1200);
}

// Cập nhật bước tiếp theo của luồng nghiệp vụ
function updateState(target) {
    if (target === 'init') {
        state.step = 'ready_screen';
    } else if (target === 'cp') {
        state.hasCP = true;
        state.step = 'racing';
    } else if (target === 'finish') {
        clearInterval(state.timerInterval); // Dừng đồng hồ khi đã về đích
        state.step = 'finish_form';
    }
    render();
}

// Hàm render giao diện động
function render() {
    const container = document.getElementById('app-content');

    if (state.step === 'init_scan') {
        container.innerHTML = `
            <div class="text-center fade-in pt-10">
                <p class="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-8">Mô phỏng: Quét QR từ Camera</p>
                <button onclick="triggerScan('init')" class="w-24 h-24 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mx-auto animate-bounce">
                    <i class="fas fa-qrcode text-3xl text-indigo-500"></i>
                </button>
            </div>
        `;
    }
    else if (state.step === 'ready_screen') {
        container.innerHTML = `
            <div class="glass p-12 rounded-[50px] text-center fade-in">
                <div class="w-20 h-20 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto mb-8 text-indigo-500 text-3xl">
                    <i class="fas fa-bolt"></i>
                </div>
                <h1 class="text-4xl font-bold mb-12 italic tracking-tight uppercase">SẴN SÀNG?</h1>
                <button onclick="startRace()" class="btn-purple w-full py-5 rounded-full font-black tracking-widest text-sm uppercase shadow-2xl shadow-indigo-500/50">
                    BẮT ĐẦU
                </button>
            </div>
        `;
    } 
    else if (state.step === 'racing') {
        container.innerHTML = `
            <div class="glass p-8 rounded-[50px] fade-in">
                <div class="flex justify-between items-center mb-10">
                    <span class="px-3 py-1 bg-indigo-500/20 text-indigo-400 rounded-full text-[9px] font-black uppercase tracking-widest">Racing Mode</span>
                    <span class="text-xs text-slate-500 font-bold uppercase">${state.startTime}</span>
                </div>
                <div class="text-center mb-12">
                    <p id="live-timer" class="text-7xl font-black tracking-tighter text-white timer-glow">${formatTimer(state.seconds)}</p>
                </div>
                <div class="space-y-4">
                    <button onclick="triggerScan('cp')" class="w-full py-5 rounded-[2rem] border-2 flex items-center justify-between px-8 transition ${state.hasCP ? 'badge-done' : 'border-slate-800 bg-slate-900/50 text-slate-500'}">
                        <span class="font-black text-xs uppercase tracking-widest">TRẠM TRUNG GIAN</span>
                        <i class="fas ${state.hasCP ? 'fa-check-circle' : 'fa-qrcode'}"></i>
                    </button>
                    <button onclick="triggerScan('finish')" class="w-full py-5 rounded-[2rem] border-2 border-slate-800 bg-slate-900/50 text-slate-500 flex items-center justify-between px-8">
                        <span class="font-black text-xs uppercase tracking-widest">VẠCH VỀ ĐÍCH</span>
                        <i class="fas fa-flag-checkered"></i>
                    </button>
                </div>
            </div>
        `;
    }
    else if (state.step === 'finish_form') {
        container.innerHTML = `
            <div class="glass p-10 rounded-[50px] fade-in text-center">
                <h2 class="text-3xl font-black italic mb-2 text-emerald-400 uppercase">Finish!</h2>
                <div class="mb-8 p-4 bg-white/5 rounded-3xl">
                    <p class="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-1">Thời gian của bạn</p>
                    <p class="text-3xl font-black text-white">${formatTimer(state.seconds)}</p>
                </div>
                <div class="space-y-4 text-left">
                    <div>
                        <label class="text-[10px] font-bold text-slate-500 ml-4 uppercase">Họ và tên</label>
                        <input type="text" id="nameInput" value="Nguyễn Văn A" class="w-full bg-slate-900 border border-slate-800 rounded-2xl py-4 px-6 outline-none focus:border-indigo-500 text-sm font-bold">
                    </div>
                    <div>
                        <label class="text-[10px] font-bold text-slate-500 ml-4 uppercase">Email</label>
                        <input type="email" placeholder="email@example.com" class="w-full bg-slate-900 border border-slate-800 rounded-2xl py-4 px-6 outline-none focus:border-indigo-500 text-sm">
                    </div>
                    <div>
                        <label class="text-[10px] font-bold text-slate-500 ml-4 uppercase">Số điện thoại</label>
                        <input type="tel" placeholder="090..." class="w-full bg-slate-900 border border-slate-800 rounded-2xl py-4 px-6 outline-none focus:border-indigo-500 text-sm">
                    </div>
                    <button onclick="goToLeaderboard()" class="btn-purple w-full py-5 rounded-full font-black tracking-widest uppercase mt-4 text-xs shadow-xl">
                        Gửi và xem kết quả
                    </button>
                </div>
            </div>
        `;
    }
    else if (state.step === 'leaderboard') {
        container.innerHTML = `
            <div class="glass p-8 rounded-[50px] fade-in">
                <h2 class="text-2xl font-black italic uppercase mb-8 text-center text-indigo-400">Hall of Fame</h2>
                <div class="space-y-3 mb-10">
                    <div class="flex justify-between p-4 bg-white/5 rounded-2xl border border-white/5 opacity-40 italic"><span>1. Trần Đạt</span><span class="font-black">00:12:10</span></div>
                    <div class="flex justify-between p-4 bg-white/5 rounded-2xl border border-white/5 opacity-40 italic"><span>2. Thu Thảo</span><span class="font-black">00:14:05</span></div>
                    <div class="flex justify-between p-4 bg-indigo-600 rounded-2xl shadow-lg border border-indigo-400"><span>3. Bạn (Vừa xong)</span><span class="font-black">${formatTimer(state.seconds)}</span></div>
                    <div class="flex justify-between p-4 bg-white/5 rounded-2xl border border-white/5 opacity-20"><span>4. Hoàng Minh</span><span class="font-black">00:18:15</span></div>
                    <div class="flex justify-between p-4 bg-white/5 rounded-2xl border border-white/5 opacity-20"><span>5. Kim Liên</span><span class="font-black">00:20:20</span></div>
                </div>
                <button onclick="resetApp()" class="w-full py-4 bg-slate-900 border border-slate-800 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-600">
                     THOÁT & KẾT THÚC
                </button>
            </div>
        `;
    }
}

// Logic điều hướng
function startRace() {
    state.step = 'racing';
    state.startTime = new Date().toLocaleTimeString('vi-VN', {hour:'2-digit', minute:'2-digit'});
    render();
    startLiveTimer();
}

function goToLeaderboard() {
    state.step = 'leaderboard';
    render();
}

function resetApp() {
    clearInterval(state.timerInterval);
    state = { step: 'init_scan', hasCP: false, startTime: "--:--", seconds: 0, timerInterval: null };
    render();
}

// Khởi chạy ứng dụng
window.onload = render;
