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
  document.querySelector('#compose-view').style.display = 'block';
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#view-email-view').style.display = 'none';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#view-email-view').style.display = 'none';

  // Clear email
  document.querySelector('#view-email-view').innerHTML = ""

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
          view_email(email.id, mailbox);
          mark_read(email.id);
        });

        if (email.read) {
          email_box.style.backgroundColor = "lightGrey";
        }

        document.querySelector('#emails-view').append(email_box);
      })
    });
}

function view_email(email_id, mailbox) {
  // Show this email's view and hide other views
  document.querySelector('#view-email-view').style.display = 'block';
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';
  
  fetch(`/emails/${email_id}`)
    .then(response => response.json())
    .then(email => {
      let email_info = document.createElement('div');
      
      email_info.append(`From: ${email.sender}`);
      email_info.append(document.createElement("br")); 
      email_info.append(`To: ${email.recipients}`); 
      email_info.append(document.createElement("br")); 
      email_info.append(`Subject: ${email.subject}`); 
      email_info.append(document.createElement("br")); 
      email_info.append(`Timestamp: ${email.timestamp}`); 
      email_info.append(document.createElement("br"));
      
      let reply_button = document.createElement("button");
      reply_button.innerHTML = "Reply";
      email_info.append(reply_button);

      if (mailbox === "inbox") {
        let archive_button = document.createElement("button");
        archive_button.innerHTML = "Archive";        

        archive_button.addEventListener('click', function () {                    
          mark_archived_or_unarchived(email_id, true);          
          load_mailbox('inbox');
        });   

        email_info.append(archive_button);
      }
      if (mailbox === "archive") {
        let archive_button = document.createElement("button");
        archive_button.innerHTML = "Unarchive";

        archive_button.addEventListener('click', function () {
          mark_archived_or_unarchived(email_id, false);
          load_mailbox('inbox');
        });

        email_info.append(archive_button);
      }

      email_info.append(document.createElement("br"));
      email_info.append(document.createElement("br"));
      email_info.append(document.createElement("br"));

      document.querySelector('#view-email-view').append(email_info);
      document.querySelector('#view-email-view').append(email.body);
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

function mark_read(email_id) {
  fetch(`/emails/${email_id}`, {
    method: 'PUT',
    body: JSON.stringify({
      read: true
    })
  })
}

function mark_archived_or_unarchived(email_id, t_or_f) {
  fetch(`/emails/${email_id}`, {
    method: 'PUT',
    body: JSON.stringify({
      archived: t_or_f
    })
  })
  if (t_or_f) {
    alert("Email archived successfully.");
  }
  else {
    alert("Email unarchived successfully.")
  }  
}