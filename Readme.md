
# Credential Saver

Credential Saver is a Chrome extension that allows users to save and auto-fill login credentials such as email, password, and phone number with one click. 

## Features

- Save login credentials (name, email, password, phone number)
- Auto-fill saved credentials on web pages
- View, edit, and delete saved credentials
- Simple and user-friendly interface

## Installation

1. Clone the repository or download the zip file and extract it.

```bash
git clone https://github.com/somarkn99/Credential-Saver.git
```

2. Open Chrome and go to `chrome://extensions/`.

3. Enable "Developer mode" by clicking the toggle switch in the top right corner.

4. Click the "Load unpacked" button and select the directory where you cloned/extracted the repository.

5. The extension should now appear in your list of extensions.

## Usage

1. Click on the Credential Saver icon in the Chrome toolbar to open the popup.

2. To add a new credential, click the "Add New" button, fill in the details, and click "Save".

3. The saved credentials will be listed in the table. You can view, edit, delete, or auto-fill them on web pages using the respective buttons.

## Files

- `background.js`: Handles background tasks such as setting up page rules.
- `content.js`: Manages content scripts for filling credentials on web pages.
- `popup.html`: The HTML structure for the extension's popup interface.
- `popup.css`: The CSS styles for the extension's popup interface.
- `popup.js`: The JavaScript code to manage the extension's popup interface functionality.
- `manifest.json`: The configuration file for the Chrome extension.

## Contributing

1. Fork the repository.
2. Create a new branch: `git checkout -b my-feature-branch`.
3. Make your changes and commit them: `git commit -m 'Add some feature'`.
4. Push to the branch: `git push origin my-feature-branch`.
5. Submit a pull request.

## License

This project is licensed under the MIT License.

## Credits

- [Somar Kesen](https://github.com/somarkn99)
- [All Contributors](../../contributors)

## Contact

For any inquiries or support, please contact:

- GitHub: [somarkn99](https://github.com/somarkn99)
- LinkedIn: [somarkesen](https://www.linkedin.com/in/somarkesen/)
- Website: [Somar Kesen](https://www.somar-kesen.com/)

---

Thank you for using Credential Saver!