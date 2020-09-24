document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);
  

                      // PROBLEM: this isnt working: 
                      // UDTATE:
                      // I think the problem is cache not being cleared...
                      // I tried changing:
                      // "document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));"
                      // to use load_mailbox('sent'), but clicking inbox still made the screen say inbox, instead of sent.

                      
  document.querySelector('#submit-botton').addEventListener('click', function () {
    alert('Hello, world!');
  });

  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
}

function sendForm() {
  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
      recipients: document.forms["compose-form"]["compose-recipients"].value,
      subject: document.forms["compose-form"]["compose-subject"].value,
      body: document.forms["compose-form"]["compose-body"].value
    })
  })
    .then(response => response.json())
    .then(result => {
      load_mailbox('sent');
      //var statusCode = response.status;

      // If success:
      //if (statusCode === 201) {
        //load_mailbox('sent');
      //} 
      // If error:
      //else {
        //document.querySelector('#error-view').innerHTML = result;
      //}      
    });
}

function testing() {
  alert('Hello, world!');
}