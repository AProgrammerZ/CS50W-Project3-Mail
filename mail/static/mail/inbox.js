document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);
  
  // Submit botton for composing email
  const element = document.querySelector('form');
  element.addEventListener('submit', event => {
    event.preventDefault();
    send_mail();
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

  // Get emails
  fetch(`/emails/${mailbox}`)
    .then(response => response.json())
    .then(emails => {
      emails.forEach(email => {
        const element = document.createElement('div');
        // fix html and css of the following line
        element.innerHTML = `${email.sender}  ${email.subject}  ${email.timestamp}`;
        element.addEventListener('click', function () {
          console.log('This element has been clicked!')
          // eventually, add code here to redirect to this email
        });
        document.querySelector('#emails-view').append(element);
      })
    });
}                   

function send_mail() {
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
      for (var message_type in result) { 
        message = result[message_type]
        alert(message);

        // If email was sent successfully
        if (message_type === "message") {
          load_mailbox('sent');      
        }        
      }
    });  
}