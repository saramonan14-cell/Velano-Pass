/**
 * CONTENT SCRIPT
 * Runs on every website visited (Netflix, Facebook, etc.)
 * Detects login forms and injects the Velano overlay.
 */

// SVG Icon for the input field
const VELANO_ICON = `
<svg width="16" height="16" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M50 94C50 94 88 80 88 48V20L50 6L12 20V48C12 80 50 94 50 94Z" fill="#0ea5e9" />
  <path d="M35 38 L50 65 L65 38" stroke="white" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`;

// 1. SCAN FOR INPUTS
function scanForInputs() {
  const passwordInputs = document.querySelectorAll('input[type="password"]');
  
  passwordInputs.forEach(pwdInput => {
    if (pwdInput.getAttribute('data-velano-attached') === 'true') return;
    
    // Find associated username input (usually the text/email input right before)
    // Simple heuristic: look at previous siblings or inputs in same form
    let form = pwdInput.form;
    let usernameInput = null;
    
    if (form) {
      const inputs = Array.from(form.querySelectorAll('input[type="text"], input[type="email"]'));
      // Pick the one closest to the password field
      usernameInput = inputs[inputs.length - 1];
    }

    attachVelanoIcon(pwdInput, usernameInput);
    pwdInput.setAttribute('data-velano-attached', 'true');
    
    // Attach Submit Listener for Auto-Save
    if (form && form.getAttribute('data-velano-listen') !== 'true') {
        form.addEventListener('submit', () => handleFormSubmit(form, usernameInput, pwdInput));
        form.setAttribute('data-velano-listen', 'true');
    }
  });
}

// 2. INJECT ICON
function attachVelanoIcon(pwdInput, usernameInput) {
  // Create wrapper logic (simplified for stability across different sites)
  const icon = document.createElement('div');
  icon.innerHTML = VELANO_ICON;
  icon.style.position = 'absolute';
  icon.style.cursor = 'pointer';
  icon.style.zIndex = '9999';
  icon.style.right = '10px';
  icon.style.top = '50%';
  icon.style.transform = 'translateY(-50%)';
  icon.style.opacity = '0.5';
  icon.style.transition = 'opacity 0.2s';
  icon.title = "Velano Pass: Autofill";

  icon.onmouseover = () => icon.style.opacity = '1';
  icon.onmouseout = () => icon.style.opacity = '0.5';
  
  icon.onclick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Request credentials from extension
    chrome.runtime.sendMessage({ type: 'OPEN_POPUP' });
    alert("Velano Pass: Please open the extension from your toolbar to fill this password.");
  };

  // Positioning hack: parent needs relative positioning usually
  // Ideally, we calculate bounding client rects.
  const rect = pwdInput.getBoundingClientRect();
  const parent = pwdInput.parentElement;
  
  if (getComputedStyle(parent).position === 'static') {
      parent.style.position = 'relative';
  }
  parent.appendChild(icon);
}

// 3. HANDLE FORM SUBMIT (AUTO-SAVE)
function handleFormSubmit(form, usernameInput, pwdInput) {
    const username = usernameInput ? usernameInput.value : '';
    const password = pwdInput.value;

    if (password && password.length > 0) {
        chrome.runtime.sendMessage({
            type: 'PROPOSE_SAVE',
            data: {
                username: username,
                password: password
            }
        });
    }
}

// Run periodically to catch dynamically loaded forms (SPA like Netflix)
setInterval(scanForInputs, 1000);
scanForInputs();
