if (typeof window != 'undefined' && window.document) {
  document.addEventListener('DOMContentLoaded', () => {
    verifyUser()
      .then(() => {})
      .catch((error) => {
        console.error('Error in verifyUserId:', error);
      });

    fetchReadings()
      .then(() => {})
      .catch((error) => {
        console.error('Error in fetchReadings:', error);
      });

    document.body.style.display = 'block';
  });

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

  async function verifyUser() {
    const userId = getCookie('userId');

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

  const initializeTable = (rows) => {
    // Sample headers and rows (you can replace these with your data)
    const headers = [
      'Ingles',
      'Espanol',
      'Autor',
      'Recomendacion (Enfasis)',
      'Comentarios',
    ];
    // Function to create an HTML table and insert it into the container
    const tableContainer = document.getElementById('tableContainer');
    const table = document.createElement('table');

    // Create table headers
    const headerRow = table.insertRow();
    headers.forEach((headerText) => {
      const th = document.createElement('th');
      th.textContent = headerText;
      headerRow.appendChild(th);
    });

    // Create table rows
    rows.forEach((row) => {
      const newRow = table.insertRow();
      row.forEach((cell) => {
        const newCell = newRow.insertCell();
        newCell.textContent = cell;
      });
    });

    tableContainer.appendChild(table);
  };

  async function fetchReadings() {
    const url = `${getScriptUrl()}?functionName=getRecommendedReadings`;

    return fetch(url, {
      method: 'POST',
      body: '',
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
            let arrayOfValues = responseObject.message.map((obj) =>
              Object.values(obj)
            );
            arrayOfValues = arrayOfValues.slice(1);
            initializeTable(arrayOfValues);
          } else if (responseObject.status === 'cantAccess') {
            const cantAccess = document.getElementById('cantAccess');
            cantAccess.style.display = 'block';
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
  }
}
