function validateEmail(emailInput) {
  var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  var email = emailInput.value;

  if (!emailPattern.test(email)) {
    emailInput.setCustomValidity('Invalid email address');
  } else {
    emailInput.setCustomValidity('');
  }

  return emailInput.validationMessage;
}

function validateFields(fieldIds) {
  for (const field in fieldIds) {
    const value = document.getElementById(field).value;
    const errorSpan = document.getElementById(fieldIds[field]);

    if (value === '') {
      errorSpan.textContent = 'This field is required.';
    } else {
      errorSpan.textContent = '';
    }
  }
}

function setCookie(name, value, days) {
  var expires = '';
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = '; expires=' + date.toUTCString();
  }
  document.cookie = name + '=' + (value || '') + expires + '; path=/';
}

function getCookie(name) {
  var nameEQ = name + '=';
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

function validateUser() {
  const userIdCookieName = 'userId';
  const userId = getCookie(userIdCookieName);

  if (userId) {
    const url = `${getScriptUrl()}?functionName=verifyUserId&userId=${userId}`;

    return fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.text();
      })
      .then((data) => {
        try {
          const responseObject = JSON.parse(data);

          if (responseObject.status === 'success') {
            document.getElementById('loading-message').style.display = 'none';
            document.getElementById('content').style.display = 'block';

            const subscriptionDate = new Date(responseObject.subscriptionDate);

            const formattedDate = subscriptionDate.toISOString().split('T')[0];

            return formattedDate;
          } else if (responseObject.status === 'cantAccess') {
            window.location.href = 'https://juanifernandez.com';
          } else {
            console.error('Server response status:', responseObject.status);
          }
        } catch (error) {
          console.error('Error parsing JSON:', error);
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  } else {
    window.location.href = 'https://juanifernandez.com';
  }
}
