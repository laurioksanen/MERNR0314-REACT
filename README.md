# MERNR0314-REACT

Linkki netlify julkaisuun: https://objective-beaver-61a847.netlify.app/

Vähän vajavainen innon puutteen Reactia kohtaan vuoksi.

Ravintolan lisäys front endin kautta ei toimi, ja jotain vaikuttaa menevän pieleen backendissä. Postmanilla lisääminen kuitenkin toimii. 

Nappi joka hakee 10 viimeisintä tulosta ei toimi toista kertaa ennen kuin päivittää sivun, ehkä sillä fetch komento on useEffect funktion sisällä, enkä osannnut luoda useState muuttujaa, joka olisi muuttanut arvoaan nappia painettaessa, tällöin suorittaen useEffect funktion uudestaan.
