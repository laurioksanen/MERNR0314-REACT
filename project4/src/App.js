//tuodaan tarvitut moduulit
import './App.css';
import axios from 'axios';
import React, { useState, useEffect }  from "react";
import ReactDOM from "react-dom";
import './index.css';

//määritellään komponentti joka sisältää sivun latauksella esitettvän rakenteen, jossa on ravintolan lisäämis..
//lomake ja nappula, jota painamalla sivu lataa 10 viimeisintä ravintolaa tietokannassa, ja esittää niiden nimen
//ja sijainnin
const AddField = () => {
  //määritellään ravintolan lisäämisesssä tarvittavat vakiot
  const url = "http://nycrestaurantdatarestapi.herokuapp.com/api/add"
  const [restaurantName, setRestaurantName] = useState('')
  const [cuisine, setCuisine] = useState('')
  const [borough, setBorough] = useState('')

  //käsitellään lomakkeen lähetys
  const handleSubmit = (event) => {
    event.preventDefault();
    //lomakkeessa annetut tiedot asetetaan tiedot vakioon ja lähetetään post kutsulla rest apille
    const tiedot = {
      name: restaurantName,
      cuisine: cuisine,
      borough: borough
    }
    //valitettavasti jokin backendissä on sökönä ja lomakkeessa annetut tiedot eivät tallennu tietokantaan
    //tallennettavaan dokumenttiin
    console.log("lähettettiin: "+ tiedot.name + ", " + tiedot.cuisine + ", " + tiedot.borough)
    axios.post(url, tiedot).then(res=>{
      console.log(res.data)
    })
  };

  //käsitellään napin, joka hakee 10 viimeisintä ravintolaa, toiminnallisuus
  const handleClick = (event) => {
    event.preventDefault();
    //renderöidään GetData komponentti tulokset nimiseen div komponenttiin hakukenttien ja nappien alle
    ReactDOM.render(<GetData />, document.getElementById("tulokset"));
  };
  
  //AddFied komponentti palauttaa alla olevan html rakenteen
  //kenttiin syötetyt tiedota tallentuvat omiin vakioihinsa ja submit nappulan paino kutsuu handleSubmit
  //funktiota, joka käsittelee ja postaa lomakkeen sisällön
  return (
    <div>
      <h1>NYC Restaurant Rest API</h1>
      <div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Lisää ravintola: </label>
            <input
              type="add"
              value={restaurantName}
              onChange={(event) => setRestaurantName(event.target.value)}
              className="form-control"
              placeholder="Syötä nimi"
              name="query"
            />
            <input
              type="add"
              value={cuisine}
              onChange={(event) => setCuisine(event.target.value)}
              className="form-control"
              placeholder="Syötä keittiö"
              name="query"
            />
            <input
              type="add"
              value={borough}
              onChange={(event) => setBorough(event.target.value)}
              className="form-control"
              placeholder="Syötä alue"
              name="query"
            />
          </div>
          <div className="form-group">
            <button type="submit" className="btn btn-primary">
              Submit
              </button>
          </div>
          <button
              type="button"
              className="btn"
              onClick={handleClick}
              style= {{"backgroundColor":"green"}}
            >
              Hae 10 uusinta
              </button>
        </form>
      </div>
    </div>
  );
};

//GetData komponentti kutsuu apia getall reitillä ja esittää saamansa datan
const GetData = () => {
  //asetetaan vakio, johon ravintolat tallennetaan
  const [raflat, setRaflat] = useState(null)
  //apia kutsutaan getch-komennolla useEffect lohkon sisällä
  useEffect(() => {
    fetch("https://nycrestaurantdatarestapi.herokuapp.com/api/getall")
      .then((results) => {
        return results.json();
      })
        //kutsun saama json data käydään läpi, ja kaikki paitsi kymmenen uusinta ravintolaa poistetaan tuloksista
        //tässä menee aika kauan, koska tietokanta on suuri kooltaan
      .then((data) => {
          const pituus = data.length
        for(var i=10;i<pituus;i++){
          data.shift();
        }
        //jäljelle jäänet ravintolat tulostetaan ja asetetaan raflat vakion arvoksi
        console.log(data)
        setRaflat(data)});
  },[])
//komponentti palauttaa alla olevan html rakenteen
//kutsuen RaflaTaulu funktiota, joka muotoilee datan listaksi ja antaa jokaiselle alkiolle napin
  return (
    <> 
      {
        raflat ?
          <RaflaTaulu data={raflat} />
          : <div>Fething data...</div>
      }
    </>
  );
}
//poista funktio poistaa annetun id:n omistavan dokumentin tietokannasta
const poista = (event) => {
  event.preventDefault();
  const id = event.target.name;
  const url = "http://nycrestaurantdatarestapi.herokuapp.com/api/delete/" + id;
  //apin /delete/:id reittiä kutsutaan .delete komennolla.
  //dokumentti poistetaan ja vastauksena saatu data esitetään konsolissa ja yritetään renderöidä GetData uudestaan
  //jolloin päivitetty taulukko päivittyisi sivulle, mutta tämä ei toimi
  axios.delete(url).then(res=>{
    console.log(res.data)
    ReactDOM.render(<GetData />, document.getElementById("tulokset"));
  })
};

//alla oleva funktio muotoilee saamansa datan listaksi
//jokainen alkio listassa saa napin, joka saa nimekseen ravinttolan id:n, ja völittää sen nappia painettaessa
//painalluksen käsittelevälle funktiolle poista
const RaflaTaulu = (props)=>{
  const {data}=props;
  var i = 0;
  return (
    <div>
      <ul>
        {data.map((item)=>(
        <li key={i++} >
          {item.name} ({item.borough})
          <button name={item._id} onClick={poista} style= {{"backgroundColor":"red"}}>Poista</button>
        </li>
        ))}
      </ul>
    </div>
  )
};

//funktio app palauttaa html rakenteen, joka sisältää AddField komponentin
function App() {
  return (
    <>
    <AddField />
    </>
  );
}
//App funktio viedään index.js tiedostoon
export default App;
