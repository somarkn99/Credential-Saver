console.log('Content script loaded');

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Message received', request);
  if (request.action === 'fill_credentials' && request.data) {
    const { email, password, phone } = request.data;
    console.log('Received fill_credentials request:', request.data);

    const fillInput = (selectors, value) => {
      let inputFilled = false;
      selectors.forEach(selector => {
        console.log(`Trying selector: ${selector}`);
        const inputs = document.querySelectorAll(selector);
        console.log(`Found ${inputs.length} input(s) for selector: ${selector}`);
        if (inputs.length > 0) {
          inputs.forEach(input => {
            if (input) {
              try {
                console.log(`Setting value for input with selector: ${selector}`);
                input.value = value;
                const event = new Event('input', { bubbles: true });
                input.dispatchEvent(event);
                inputFilled = true;
              } catch (error) {
                console.error(`Error setting value for selector ${selector}:`, error);
              }
            } else {
              console.error(`Element with selector ${selector} is null`);
            }
          });
        } else {
          console.log(`No inputs found for selector: ${selector}`);
        }
      });
      return inputFilled;
    };

    const emailSelectors = [
      'input[type=email]',
      'input[name*=email]',
      'input[id*=email]',
      'input[name*=Email]',
      'input[id*=Email]',
      'input[class*=email]',
      'input[class*=Email]',
      'input[name=emailadr]'
    ];
    const passwordSelectors = [
      'input[type=password]',
      'input[name*=password]',
      'input[id*=password]',
      'input[name*=Password]',
      'input[id*=Password]',
      'input[class*=password]',
      'input[class*=Password]',
      'input[name=31password]'
    ];
    const phoneSelectors = [
      'input[type=tel]',
      'input[name*=phone]',
      'input[id*=phone]',
      'input[type=text][name*=phone]',
      'input[type=text][id*=phone]',
      'input[name*=Phone]',
      'input[id*=Phone]',
      'input[class*=phone]',
      'input[class*=Phone]',
      'input[name*=cellphon]',
      'input[name*=workphon]',
      'input[name*=faxphone]',
      'input[name*=homephon]'
    ];

    const emailFilled = fillInput(emailSelectors, email);
    const passwordFilled = fillInput(passwordSelectors, password);
    const phoneFilled = fillInput(phoneSelectors, phone);

    if (!emailFilled) {
      console.warn('No email input found to fill');
    }
    if (!passwordFilled) {
      console.warn('No password input found to fill');
    }
    if (!phoneFilled) {
      console.warn('No phone input found to fill');
    }

    sendResponse({ status: 'done' });
  }
});
