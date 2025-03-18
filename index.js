const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PRIVATE_APP_ACCESS = 'f4487a94-478c-4b10-97c4-a74e894adfc9';
const HUBSPOT_CUSTOM_OBJECT = 'company';

//Route 1: Render Homepage & Fetch Custom Object Data
app.get('/', async (req, res) => {
    try {
        const response = await axios.get(
            `https://api.hubapi.com/crm/v3/objects/${HUBSPOT_CUSTOM_OBJECT}`,
            { headers: { Authorization: `Bearer ${PRIVATE_APP_ACCESS}` } }
        );

        res.render('homepage', { title: 'Custom Objects Table', objects: response.data.results });
    } catch (error) {
        console.error("Error fetching data:", error.response?.data || error.message);
        res.status(500).send("Error fetching custom objects.");
    }
});

//Route 2: Render Form for Creating/Updating Custom Object
app.get('/update-cobj', (req, res) => {
    res.render('updates', { title: 'Update Custom Object Form | Integrating With HubSpot I Practicum' });
});

//Route 3: Handle Form Submission to Create/Update Custom Object
app.post('/update-cobj', async (req, res) => {
    const { company1, company2, company3 } = req.body; 

    try {
        const response = await axios.post(
            `https://api.hubapi.com/crm/v3/objects/${HUBSPOT_CUSTOM_OBJECT}`,
            {
                properties: {
                    company1,
                    company2,
                    company3,
                },
            },
            { headers: { Authorization: `Bearer ${PRIVATE_APP_ACCESS}`, "Content-Type": "application/json" } }
        );

        console.log("Object created/updated:", response.data);
        res.redirect("/"); 
    } catch (error) {
        console.error("Error updating object:", error.response?.data || error.message);
        res.status(500).send("Error creating/updating custom object.");
    }
});

app.listen(3000, () => console.log('Listening on http://localhost:3000'));
