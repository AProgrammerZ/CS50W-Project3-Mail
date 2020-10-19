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
  get_emails(mailbox);
}                   

function get_emails(mailbox) {
  fetch(`/emails/${mailbox}`)
    .then(response => response.json())
    .then(emails => {
      emails.forEach(email => {

        let email_box = document.createElement('div');
        email_box.className = "email_box";

        let sender = document.createElement('div');
        sender.innerHTML = email.sender;
        sender.className = "sender";
        let subject = document.createElement('div');
        subject.innerHTML = email.subject;
        subject.className = "subject";
        let timestamp = document.createElement('div');
        timestamp.innerHTML = email.timestamp;
        timestamp.className = "timestamp";

        email_box.append(sender, subject, timestamp);
        email_box.addEventListener('click', function () {
          // eventually, add code here to redirect to this email
          view_email(email.id);
        });
        document.querySelector('#emails-view').append(email_box);
      })
    });
}

function view_email(email_id) {

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