document.addEventListener('DOMContentLoaded', () => {
    const earningsDisplay = document.getElementById('earnings');
    const elapsedTimeDisplay = document.getElementById('elapsedTime');
    const hourlyRateInput = document.getElementById('hourlyRate');
    const hourlyRateGroup = document.getElementById('hourlyRateGroup');
    const startStopBtn = document.getElementById('startStopBtn');
    const resetBtn = document.getElementById('resetBtn');
    const darkModeToggle = document.getElementById('darkModeToggle');
    const logoImg = document.getElementById('logo-img');
    const mainCurrencySymbolDisplay = document.getElementById('mainCurrencySymbol');
    const currencyTrigger = document.getElementById('currencyTrigger');
    const currentCurrencyTextDisplay = document.getElementById('currentCurrencyText');
    const currencyPopover = document.getElementById('currencyPopover');
    const currencyOptions = document.querySelectorAll('.currency-option');

    let startTime = 0;
    let elapsedTime = 0;
    let timerInterval = null;
    let isRunning = false;
    let hourlyRate = parseFloat(hourlyRateInput.value) || 0;
    let currentCurrencySymbol = "$";
    let currentCurrencyCode = "USD";

    const initialCurrencyOption = currencyOptions[0];
    if (initialCurrencyOption) {
        currentCurrencySymbol = initialCurrencyOption.getAttribute('data-value');
        currentCurrencyCode = initialCurrencyOption.getAttribute('data-text');
    }

    const lightLogo = 'assets/logo.svg';
    const darkLogo = 'assets/logo-dark.svg';

    if (localStorage.getItem('darkMode') === 'enabled') {
        document.body.classList.add('dark-mode');
        darkModeToggle.checked = true;
        logoImg.src = darkLogo;
    } else {
        logoImg.src = lightLogo;
    }

    function formatTime(ms) {
        let totalSeconds = Math.floor(ms / 1000);
        let hours = Math.floor(totalSeconds / 3600);
        totalSeconds %= 3600;
        let minutes = Math.floor(totalSeconds / 60);
        let seconds = totalSeconds % 60;
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    function calculateEarnings(ms) {
        const hoursWorked = ms / (1000 * 60 * 60);
        return (hoursWorked * hourlyRate).toFixed(2);
    }

    function updateDisplay() {
        elapsedTimeDisplay.textContent = formatTime(elapsedTime);
        earningsDisplay.textContent = calculateEarnings(elapsedTime);
        mainCurrencySymbolDisplay.textContent = currentCurrencySymbol;
        currentCurrencyTextDisplay.textContent = currentCurrencyCode;
    }

    function startTimer() {
        if (isRunning) return;
        isRunning = true;
        startTime = Date.now() - elapsedTime;
        timerInterval = setInterval(() => {
            elapsedTime = Date.now() - startTime;
            updateDisplay();
        }, 10);
        startStopBtn.innerHTML = '<i class="fas fa-pause"></i> Pause';
        hourlyRateInput.disabled = true;
        hourlyRateGroup.classList.add('disabled');
        if (currencyPopover.classList.contains('show')) {
            currencyPopover.classList.remove('show');
            currencyTrigger.classList.remove('open');
        }
    }

    function stopTimer() {
        if (!isRunning) return;
        isRunning = false;
        clearInterval(timerInterval);
        startStopBtn.innerHTML = '<i class="fas fa-play"></i> Start';
        hourlyRateInput.disabled = false;
        hourlyRateGroup.classList.remove('disabled');
    }

    function resetTimer() {
        stopTimer();
        elapsedTime = 0;
        updateDisplay();
    }

    startStopBtn.addEventListener('click', () => {
        if (isRunning) {
            stopTimer();
        } else {
            hourlyRate = parseFloat(hourlyRateInput.value) || 0;
            if (hourlyRate <= 0) {
                alert("Please enter a valid hourly rate greater than 0.");
                return;
            }
            startTimer();
        }
    });

    resetBtn.addEventListener('click', resetTimer);

    hourlyRateInput.addEventListener('change', () => {
        if (!isRunning) {
            hourlyRate = parseFloat(hourlyRateInput.value) || 0;
            updateDisplay();
        }
    });

    currencyTrigger.addEventListener('click', (event) => {
        event.stopPropagation();
        currencyPopover.classList.toggle('show');
        currencyTrigger.classList.toggle('open');
    });

    currencyOptions.forEach(option => {
        option.addEventListener('click', () => {
            currentCurrencySymbol = option.getAttribute('data-value');
            currentCurrencyCode = option.getAttribute('data-text');
            updateDisplay();
            currencyPopover.classList.remove('show');
            currencyTrigger.classList.remove('open');
        });
    });

    document.addEventListener('click', (event) => {
        if (!currencyPopover.contains(event.target) && !currencyTrigger.contains(event.target)) {
            if (currencyPopover.classList.contains('show')) {
                currencyPopover.classList.remove('show');
                currencyTrigger.classList.remove('open');
            }
        }
    });

    darkModeToggle.addEventListener('change', () => {
        document.body.classList.toggle('dark-mode');
        if (document.body.classList.contains('dark-mode')) {
            localStorage.setItem('darkMode', 'enabled');
            logoImg.src = darkLogo;
        } else {
            localStorage.setItem('darkMode', 'disabled');
            logoImg.src = lightLogo;
        }
    });

    updateDisplay();
}); 