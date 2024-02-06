const express = require('express');
const mysql = require('mysql');
const app = express();
const port = 3000; // Change the port if needed


// Create MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'kds'
});

// Connect to MySQL
connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL database');
});



app.get('/urunler', (req, res) => {
  connection.query('SELECT urun_adi, fiyat FROM urunler', (error, results) => {
    if (error) throw error;

    res.json(results);
  });
});


app.get('/net_kar_view', (req, res) => {
  connection.query('SELECT * from net_kar_view', (error, results) => {
    if (error) throw error;

    res.json(results);
  });
});





app.get('/subeler.html', (req, res) => {
  res.sendFile(__dirname + '/subeler.html');
});




app.get('/filtere', (req, res) => {
  const category = req.query.category;

  // Query data based on the category filter
  connection.query('SELECT urunler.urun_adi,(urun_satis.birim_fiyat - urunler.fiyat) AS net_kar FROM urunler JOIN urun_satis on urunler.urun_id=urun_satis.urun_id join kategori on kategori.kategori_id=urunler.kategori_id where kategori.kategori_id= ? group by urunler.urun_id ', [category], (error, results) => {
    if (error) {
      console.error('Error fetching data from database:', error);

      
      res.status(500).send('Error fetching data from database');
      return;
    }

    // Send filtered data as JSON response
    res.json(results);
    });
  });









  app.get('/sube_bilgileinderi', (req, res) => {
    connection.query('SELECT * FROM sube_bilgileri', (error, results) => {
      if (error) throw error;
  
      res.json(results);
    });
  });
  


// Express route to +++++++ fetch data
app.get('/data', (req, res) => {
  const query = 'SELECT * FROM urunler'; // Change the query according to your table structure
  connection.query(query, (err, results) => {
    if (err) throw err;

    // Process data for Chart.js
    const labels = results.map((row) => row.urun_adi);
    const values = results.map((row) => row.fiyat);

    const data = {
      labels: labels,
      datasets: [
        {
          label: 'Ürünlerin Satış Öncesi Fiyatları',
          data: values,
          backgroundColor: 'orange',
          borderColor: '#2e722f',
          borderWidth: 1
        }
      ]
    };

    res.json(data); // Send data as JSON response
  });
});

// app.get('/datas', (req, res) => {
//   const query = "SELECT * FROM subeurunadet" // Change the query according to your table structure
//   connection.query(query, (err, results) => {
//     if (err) throw err;

//     // Process data for Chart.js
//     const labels = results.map((row) => row.tur);
//     const values = results.map((row) => row.sayi);

//     const data = {
//       labels: labels,
//       datasets: [
//         {
//           label: 'sayılar',
//           data: values,
//           backgroundColor: [
//             'rgb(0, 255, 134)',
//             'rgb(213, 0, 0)',
//             'rgba(255,200,86)',
//             'rgb(79, 204, 58)',
//             'rgb(255, 72, 0)',
//             'rgba(255, 150, 75)',
//             'rgb(255, 50, 23)'],
//           borderColor:[ 
//             'rgb(0, 255, 134)',
//             'rgb(213, 0, 0)',
//             'rgba(255,200,86)',
//             'rgb(79, 204, 58)',
//             'rgb(255, 72, 0)',
//             'rgba(255, 150, 75)',
//             'rgb(255, 50, 23)'],
//           borderWidth: 1
//         }
//       ]
//     };

//     res.json(data); // Send data as JSON response
//   });
// });


app.get('/filter', (req, res) => {
  const category = req.query.category;

  // Query data based on the category filter
  connection.query('SELECT urunler.urun_adi, subeler.sube_adi , sum(urun_satis.miktar) as miktar FROM urunler,satislar,urun_satis,subeler WHERE urunler.urun_id=urun_satis.urun_id and urun_satis.satis_id=satislar.satis_id and subeler.sube_id=satislar.sube_id  and urunler.urun_adi=? GROUP by urun_satis.urun_id,satislar.sube_id;', [category], (error, results) => {
    if (error) {
      console.error('Error fetching data from database:', error);
      res.status(500).send('Error fetching data from database');
      return;
    }

    // Send filtered data as JSON response
    res.json(results);
  });
});



// app.get('/datas', (req, res) => {
//   const query = "SELECT urun_adi, net_kar FROM urunkarview" // Change the query according to your table structure
//   connection.query(query, (err, results) => {
//     if (err) throw err;

//     // Process data for Chart.js
//     const labels = results.map((row) => row.urun_adi);
//     const values = results.map((row) => row.net_kar);

//     const data = {
//       labels: labels,
//       datasets: [
//         {
//           label: 'sayılar',
//           data: values,
//           backgroundColor: [
//             'rgb(0, 255, 134)',
//             'rgb(213, 0, 0)',
//             'rgba(255,200,86)',
//             'rgb(79, 204, 58)',
//             'rgb(255, 72, 0)',
//             'rgba(255, 150, 75)',
//             'rgb(255, 50, 23)'],
//           borderColor:[ 
//             'rgb(0, 255, 134)',
//             'rgb(213, 0, 0)',
//             'rgba(255,200,86)',
//             'rgb(79, 204, 58)',
//             'rgb(255, 72, 0)',
//             'rgba(255, 150, 75)',
//             'rgb(255, 50, 23)'],
//           borderWidth: 1
//         }
//       ]
//     };

//     res.json(data); // Send data as JSON response
//   });
// });

app.get('/datask', (req, res) => {
  const query = "SELECT bolgeler.bolge_adi, COUNT(subeler.sube_id) AS sube_sayisi FROM bolgeler LEFT JOIN iller on iller.bolge_id=bolgeler.bolge_id left join subeler on subeler.il_id=iller.il_id GROUP BY bolgeler.bolge_id"
  connection.query(query, (err, results) => {
    if (err) throw err;

    // Process data for Chart.js
    const labels = results.map((row) => row.bolge_adi);
    const values = results.map((row) => row.sube_sayisi);

    const data = {
      labels: labels,
      datasets: [
        {
          label: 'Mağaza Sayısı',
          data: values,
          backgroundColor: [
            'rgb(0, 255, 134)',
            'rgb(213, 0, 0)',
            'rgba(255,200,86)',
            'rgb(79, 204, 58)',
            'rgb(255, 72, 0)',
            'rgba(255, 150, 75)',
            'rgb(255, 50, 23)'],
          borderColor:[ 
            'rgb(0, 255, 134)',
            'rgb(213, 0, 0)',
            'rgba(255,200,86)',
            'rgb(79, 204, 58)',
            'rgb(255, 72, 0)',
            'rgba(255, 150, 75)',
            'rgb(255, 50, 23)'],
          borderWidth: 1
        }
      ]
    };

    res.json(data); // Send data as JSON response
  });
});



app.get('/satislar.html', (req, res) => {
  res.sendFile(__dirname + '/satislar.html'); // Change the path to your HTML file
});



// Serve the webpage with Chart.js
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/login.html'); // Change the path to your HTML file
});

app.get('/subeler.html', (req, res) => {
  res.sendFile(__dirname + '/subeler.html'); // Change the path to your HTML file
});

app.get('/urunler.html', (req, res) => {
  res.sendFile(__dirname + '/urunler.html'); // Change the path to your HTML file
});




// Start the server
app.listen(port, () => {
});
