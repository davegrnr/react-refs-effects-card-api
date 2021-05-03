import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import Card from './Card'

const BASE_URL = "http://deckofcardsapi.com/api/deck";

const Deck = () => {
    const [deck, setDeck] = useState(null);
    const [drawn, setDrawn] = useState([])
    const [autoDraw, setAutoDraw] = useState(false)
    const timerRef = useRef(null)

    // Get deck from API and set state
    useEffect(() => {
        async function getDeck() {
            let res = await axios.get(`${BASE_URL}/new/shuffle`);
            setDeck(res.data);

        }
        getDeck();
    }, [setDeck]);

    // Draw a card
    useEffect(() => {
        async function drawCard() {
            let { deck_id } = deck;
            

            try {
                let cardRes = await axios.get(`${BASE_URL}/${deck_id}/draw/`);

                if (cardRes.data.remaining === 0) {
                    throw new Error("No cards remaining!")
                    setAutoDraw(false)
                }

                const card = cardRes.data.cards[0]

                setDrawn(c => [
                    ...c,
                    {
                        id: card.code,
                        name: card.value + " of " + card.suit
                    }
                ]);
            } catch(e){
                alert(e)
            }
        }

        if(autoDraw && !timerRef.current) {
            timerRef.current = setInterval(async () => {
                await drawCard()
            }, 1000)
        }

        return () => {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
    }, [autoDraw, setAutoDraw, deck]);

    const toggleAuto = () => {
        setAutoDraw(auto => !auto)
    }
    
        


    const cards = drawn.map(c => (
        <Card key={c.id} name={c.name} />
    ))


    return (
        <div className="Deck">
            {deck ? (
                <button className="Deck-btn" onClick={toggleAuto}>
                    {autoDraw ? "Stop" : "Start"} Drawing cards!</button>
            ) : null}
            <div className="Deck-cards">{cards}</div>
        </div>

    )
}

export default Deck