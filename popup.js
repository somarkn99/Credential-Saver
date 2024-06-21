// Wait for the DOM to fully load before executing the script
document.addEventListener('DOMContentLoaded', () => {
  // Get references to DOM elements
  const addButton = document.getElementById('add-button');
  const backButton = document.getElementById('back-button');
  const backEditButton = document.getElementById('back-edit-button');
  const saveButton = document.getElementById('save');
  const updateButton = document.getElementById('update');
  const credentialsList = document.getElementById('credentials-list');
  const credentialTable = document.getElementById('credential-table');
  const addCredentialForm = document.getElementById('add-credential-form');
  const editCredentialForm = document.getElementById('edit-credential-form');

  // Variable to store the name of the credential being edited
  let editingCredentialName = '';

  // Function to show the form for adding a new credential
  const showAddCredentialForm = () => {
    credentialTable.style.display = 'none';
    addCredentialForm.style.display = 'block';
    backButton.style.display = 'block';
  };

  // Function to show the form for editing an existing credential
  const showEditCredentialForm = () => {
    credentialTable.style.display = 'none';
    editCredentialForm.style.display = 'block';
    backEditButton.style.display = 'block';
  };

  // Function to show the main credential table
  const showCredentialTable = () => {
    credentialTable.style.display = 'block';
    addCredentialForm.style.display = 'none';
    editCredentialForm.style.display = 'none';
    backButton.style.display = 'none';
    backEditButton.style.display = 'none';
  };

  // Function to handle errors and display messages to the user
  const handleError = (message) => {
    console.error(message);
    alert(message);
  };

  // Event listeners for buttons to show forms and the main table
  addButton.addEventListener('click', showAddCredentialForm);
  backButton.addEventListener('click', showCredentialTable);
  backEditButton.addEventListener('click', showCredentialTable);

  // Event listener to save a new credential
  saveButton.addEventListener('click', () => {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const phone = document.getElementById('phone').value;

    // Validate input fields
    if (!name || !email || !password || !phone) {
      handleError('All fields are required!');
      return;
    }

    console.log('Saving credential', { name, email, password, phone });

    // Retrieve existing credentials from storage and add the new one
    chrome.storage.sync.get('credentials', (data) => {
      const credentials = data.credentials || {};
      credentials[name] = { email, password, phone };

      // Save the updated credentials back to storage
      chrome.storage.sync.set({ credentials }, () => {
        console.log('Credentials saved');
        loadCredentials();
        showCredentialTable();
      });
    });
  });

  // Event listener to update an existing credential
  updateButton.addEventListener('click', () => {
    const name = document.getElementById('edit-name').value;
    const email = document.getElementById('edit-email').value;
    const password = document.getElementById('edit-password').value;
    const phone = document.getElementById('edit-phone').value;

    // Validate input fields
    if (!name || !email || !password || !phone) {
      handleError('All fields are required!');
      return;
    }

    console.log('Updating credential', { name, email, password, phone });

    // Retrieve existing credentials from storage, update the specified credential, and save it back
    chrome.storage.sync.get('credentials', (data) => {
      const credentials = data.credentials || {};
      delete credentials[editingCredentialName];
      credentials[name] = { email, password, phone };

      chrome.storage.sync.set({ credentials }, () => {
        console.log('Credentials updated');
        loadCredentials();
        showCredentialTable();
      });
    });
  });

  // Function to load and display the list of credentials
  const loadCredentials = () => {
    chrome.storage.sync.get('credentials', (data) => {
      const credentials = data.credentials || {};
      credentialsList.innerHTML = '';
      for (const name in credentials) {
        // Create a row for each credential
        const row = document.createElement('tr');
        const nameCell = document.createElement('td');
        nameCell.textContent = name;
        const actionCell = document.createElement('td');
        actionCell.className = 'icons';

        // Create buttons for each action (view, edit, delete, fill)
        const viewButton = document.createElement('button');
        viewButton.className = 'icon-button view';
        const viewIcon = document.createElement('i');
        viewIcon.className = 'fas fa-eye';
        viewButton.appendChild(viewIcon);
        viewButton.addEventListener('click', () => {
          alert(`Email: ${credentials[name].email}\nPassword: ${credentials[name].password}\nPhone: ${credentials[name].phone}`);
        });

        const editButton = document.createElement('button');
        editButton.className = 'icon-button edit';
        const editIcon = document.createElement('i');
        editIcon.className = 'fas fa-pen';
        editButton.appendChild(editIcon);
        editButton.addEventListener('click', () => {
          editingCredentialName = name;
          document.getElementById('edit-name').value = name;
          document.getElementById('edit-email').value = credentials[name].email;
          document.getElementById('edit-password').value = credentials[name].password;
          document.getElementById('edit-phone').value = credentials[name].phone;
          showEditCredentialForm();
        });

        const deleteButton = document.createElement('button');
        deleteButton.className = 'icon-button delete';
        const deleteIcon = document.createElement('i');
        deleteIcon.className = 'fas fa-trash';
        deleteButton.appendChild(deleteIcon);
        deleteButton.addEventListener('click', () => {
          chrome.storage.sync.get('credentials', (data) => {
            const credentials = data.credentials || {};
            delete credentials[name];
            chrome.storage.sync.set({ credentials }, () => {
              console.log('Credential deleted');
              loadCredentials();
            });
          });
        });

        const fillButton = document.createElement('button');
        fillButton.className = 'icon-button fill';
        const fillIcon = document.createElement('i');
        fillIcon.className = 'fas fa-key';
        fillButton.appendChild(fillIcon);
        fillButton.addEventListener('click', () => {
          chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs.length === 0) {
              console.error('No active tab found');
              return;
            }

            const selectedCredential = credentials[name];
            console.log('Sending fill_credentials message to tab', tabs[0].id, selectedCredential);
            chrome.tabs.sendMessage(tabs[0].id, { action: 'fill_credentials', data: selectedCredential }, (response) => {
              if (chrome.runtime.lastError) {
                console.error(chrome.runtime.lastError);
              } else {
                console.log('Response:', response);
              }
            });
          });
        });

        // Append buttons to the action cell
        actionCell.appendChild(viewButton);
        actionCell.appendChild(editButton);
        actionCell.appendChild(deleteButton);
        actionCell.appendChild(fillButton);
        row.appendChild(nameCell);
        row.appendChild(actionCell);
        credentialsList.appendChild(row);
      }
    });
  };

  // Load credentials when the popup is opened
  loadCredentials();
});
