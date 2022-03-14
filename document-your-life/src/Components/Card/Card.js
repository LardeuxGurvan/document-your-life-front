/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-key */
import React from 'react'
import { useState, useEffect } from 'react';
import getAllCards, { deleteCard, getTodayCard, patchTodayCardFiles, putTodayCardMood, putTodayCardText } from '../../RequestsAxios/CardsReq';
import TextField from '@mui/material/TextField';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLaughBeam, faSadTear, faSmileWink, faMehBlank, faKeyboard, faCamera, faMicrophone, faVideo, faTimes, faXmark, faPencil } from '@fortawesome/free-solid-svg-icons';

import './card.scss';
import { useLocation, useNavigate } from 'react-router-dom';
import Spinner from '../../utils/Spinner/Spinner';
import labelToColor from '../../utils/LabelToColor/LabelToColor';

const Card = () => {
  let nav = useNavigate()
  let idFromLocation = useLocation().pathname.split('/card/').at(-1)

  const [toggleDel, setToggleDel] = useState(false)

  const [isLoading, setIsLoading] = useState(true)
  const [edit, setEdit] = useState(true)

  const [toggleText, setToggleText] = useState(true)
  const [togglePicture, setTogglePicture] = useState(true)
  const [toggleVideo, setToggleVideo] = useState(true)
  const [toggleSound, setToggleSound] = useState(true)

  const [render, setRender] = useState(true)
  const [cardId, setCardId] = useState(Number);
  const [cardTodayId, setCardTodayId] = useState(Number);
  const [today, setToday] = useState(false);
  
  
  const [date, setDate] = useState();
  const [mood, setMood] = useState([]);
  const [texts, setTexts] = useState(['']);
  const [sounds, setSounds] = useState([]);
  const [pictures, setPictures] = useState([]);
  const [videos, setVideos] = useState([]);

  const [happyPut, setHappyPut] = useState(null);
  const [sadPut, setSadPut] = useState(null);
  const [coolPut, setCoolPut] = useState(null);
  const [neutralPut, setNeutralPut] = useState(null);
  const [textPut, setTextPut] = useState('');
  const [photoPut, setPhotoPut] = useState(null);
  const [microPut, setMicroPut] = useState(null);
  const [videoPut, setVideoPut] = useState(null);

  async function handleSubCard(value) {
    await putTodayCardMood(value)
    setRender(!render)
  }

  async function handleOnSubmit() {
    if (happyPut !== null) {
      await putTodayCardMood(happyPut)
      setEdit(!edit)
      console.log("happy submitted")
      return setRender(!render)
    }
    if (sadPut !== null) {
      await putTodayCardMood(sadPut)
      setEdit(!edit)
      console.log("sad submitted")
      return setRender(!render)
    }
    if (coolPut !== null) {
      await putTodayCardMood(coolPut)
      setEdit(!edit)
      console.log("cool submitted")
      return setRender(!render)
    }
    if (neutralPut !== null) {
      await putTodayCardMood(neutralPut)
      setEdit(!edit)
      console.log("neutral submitted")
      return setRender(!render)
    }
    if (textPut !== '') {
      await putTodayCardText(textPut)
      setToggleSound(!toggleText)
      console.log("text submitted")
      return setRender(!render)
    }
    if (photoPut !== null) {
      await patchTodayCardFiles("image", photoPut.target.files[0])
      setEdit(!edit)
      console.log("image submitted")
      return setRender(!render)
    }
    if (microPut !== null) {
      await patchTodayCardFiles("audio", microPut.target.files[0])
      setEdit(!edit)
      console.log("audio submitted")
      return setRender(!render)
    }
    if (videoPut !== null) {
      await patchTodayCardFiles("video", videoPut.target.files[0])
      setEdit(!edit)
      console.log("video submitted")
      return setRender(!render)
    }

  }

  function textinput(e) {
    e.preventDefault()
    handleOnSubmit()
    setToggleText(true)
  }
  function handleText(e) {
    setTextPut(e.target.value)
  }


  async function dayCardData() {
    const dayCard = await getAllCards(idFromLocation);
    if (dayCard.status === 200) {
      setCardId(dayCard.data.card.id)
      setDate(dayCard.data.card.dateString);
      setMood(dayCard.data.card.moodlabel);
      setTexts(dayCard.data.card.text);
      setSounds(dayCard.data.card.audio);
      setPictures(dayCard.data.card.image);
      setVideos(dayCard.data.card.video);
      return setIsLoading(false)
    }
    else {
      console.log('erreur')
    }
  }
  async function todayCard() {
    const dayCard = await getTodayCard(idFromLocation);
    if (dayCard.status === 200) {
      setCardTodayId(dayCard.data.lastCards[0].id)
    }
    else {
      console.log('erreur')
    }
  }
  function isTodayCard() {
    if (cardId === cardTodayId) {
      setToday(true)
      console.log('this card id is :', cardId, 'today card id is :', cardTodayId)
    }else{
      setToday(false)
      console.log('this card id is :', cardId, 'today card id is :', cardTodayId)
    }
  }


  function hanldeDeleteCard() {
    deleteCard(cardId)
    setToggleDel(!toggleDel)
    nav('/Dashboard/calendar')
  }

  useEffect(() => {
    dayCardData()
    todayCard()
  }, [render]);
  
  useEffect(() => {
    isTodayCard()
  }, []);

  useEffect((e) => {
    handleOnSubmit()
  }, [
    photoPut,
    microPut,
    videoPut
  ]);



  return (
    <>
      <div className='card-container'>
        {isLoading ? <Spinner /> :
          <div style={labelToColor(mood)} className='card'>
            <h2>{date}</h2>
            <div className='card-medium'>
              <h3>Résumé de la journée
                {today && (<>
                {edit && <button className='editMode-btn' onClick={() => { setEdit(!edit) }}>
                  <FontAwesomeIcon className='editMode-btn-pencil' icon={faPencil} name="Edit" />
                </button>}</>)}</h3>
              <div className='card-medium-infos'>
                {!toggleText &&
                  <form onSubmit={textinput} >
                    <TextField
                      id="outlined-multiline-flexible"
                      label="Exprime toi"
                      multiline
                      value={textPut}
                      onChange={handleText}
                    />
                    <button className='card-medium-infos-submit-text'>Envoyer</button>
                  </form>
                }

                <div onClick={() => { setToggleText(!toggleText) }} className='card-text'>  {texts}</div>
                {!toggleSound &&
                  <div>
                    <label >
                      <input type="file" max-size="5000" name="upload_file" onChange={setMicroPut} />
                    </label>
                  </div>
                }
                <div>{sounds}</div>

                <label >
                  <input type="file" max-size="5000" name="upload_file" onChange={setPhotoPut}>
                  </input>
                  <img onClick={() => { setTogglePicture(!togglePicture) }} className='card-user-video' src={pictures} />
                </label>
                <label >
                  <iframe
                    src={videos}
                    height='600'
                    width='100%'
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                  <input type="file" max-size="5000" name="upload_file" onChange={setVideoPut} />
                </label>
              </div>
            </div>
            {!today && 
            <button className='card-delete-modal-openModal' onClick={() => setToggleDel(!toggleDel)}>Supprimer la carte</button>
            }
          </div>
        }

        {toggleDel && <>
          <div className='card-delete-modal'>
            <p className='card-delete-modal-title'>Êtes-vous sûr de vouloir supprimer cette carte ? </p>
            <div className='card-delete-modal-btn-container' >
              <button className='card-delete-modal-btn-supp' onClick={hanldeDeleteCard}>Supprimer la carte</button>
              <button className='card-delete-modal-btn-cancel' onClick={() => setToggleDel(false)}>Annuler</button>
            </div>
          </div>
        </>
        }
        {!edit &&
          <form className='editMode' onSubmit={handleOnSubmit} >
            <button className='editMode-btn-modal' onClick={() => { setEdit(!edit) }}>
              <FontAwesomeIcon icon={faXmark} name="Close" />
            </button>
            <div className='editMode-moods'>
              <FontAwesomeIcon style={labelToColor("Happy")} icon={faLaughBeam} className="editMode-moods-happy" name="Happy" onClick={() => handleSubCard("happy")} />
              <FontAwesomeIcon style={labelToColor("Sad")} icon={faSadTear} className="editMode-moods-sad" name="Sad" onClick={() => handleSubCard("sad")} />
              <FontAwesomeIcon style={labelToColor("Cool")} icon={faSmileWink} className="editMode-moods-cool" name="Cool" onClick={() => handleSubCard("cool")} />
              <FontAwesomeIcon style={labelToColor("Neutral")} icon={faMehBlank} className="editMode-moods-neutral" name="Neutral" onClick={() => handleSubCard("neutral")} />
            </div>
            <div className='editMode-container'>
              <div >
                <FontAwesomeIcon onClick={() => setToggleText(!toggleText)} icon={faKeyboard} className="editMode-file" name="Text" />
              </div>

              <div>
                <label >
                  <FontAwesomeIcon icon={faCamera} className="editMode-file" name="Photo" />
                  <input type="file" max-size="5000" name="upload_file" onChange={setPhotoPut} />
                </label>
              </div>
              <div>
                <label >
                  <FontAwesomeIcon icon={faVideo} className="editMode-file" name="Video" />
                  <input type="file" max-size="5000" name="upload_file" onChange={setVideoPut} />
                </label>
              </div>

              <div>
                <label >
                  <FontAwesomeIcon icon={faMicrophone} className="editMode-file" name="Micro" />
                  <input type="file" max-size="5000" name="upload_file" onChange={setMicroPut} />
                </label>
              </div>

            </div>
          </form>
        }
      </div>

    </>
  )
}

export default React.memo(Card);