/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-key */
import React from 'react'
import { useState, useEffect } from 'react';
import getAllCards, { deleteCard, getTodayCard, patchTodayCardFiles, putTodayCardMood, putTodayCardText } from '../../RequestsAxios/CardsReq';
import TextField from '@mui/material/TextField';
import ReactAudioPlayer from 'react-audio-player';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLaughBeam, faSadTear, faSmileWink, faMehBlank, faKeyboard, faCamera, faMicrophone, faVideo, faTimes, faXmark, faPencil } from '@fortawesome/free-solid-svg-icons';

import './card.scss';
import { useLocation, useNavigate } from 'react-router-dom';
import Spinner from '../../utils/Spinner/Spinner';
import labelToColor from '../../utils/LabelToColor/LabelToColor';
import { ToastContainer } from 'react-toastify';
import Notify from '../../utils/notifyFunc';

const Card = () => {
  let nav = useNavigate()
  let idFromLocation = useLocation().pathname.split('/card/').at(-1)

  const [toggleDel, setToggleDel] = useState(false)

  const [isLoading, setIsLoading] = useState(true)
  const [edit, setEdit] = useState(false)
  
  const [toggleTextField, setToggleTextField] = useState(false)
  const [togglePicture, setTogglePicture] = useState(true)
  const [toggleVideo, setToggleVideo] = useState(true)

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

  const [textPut, setTextPut] = useState(undefined);
  const [photoPut, setPhotoPut] = useState(null);
  const [microPut, setMicroPut] = useState(null);
  const [videoPut, setVideoPut] = useState(null);

  async function handleSubCard(value) {
    await putTodayCardMood(value)
    setRender(!render)
  }

  async function handleOnSubmitText(e) {
    if (textPut !== undefined) {
      const res = await putTodayCardText(textPut)
      console.log("text api res:", res.status)
      setToggleTextField(false)
      console.log("text submitted")
      return setRender(!render)
    }}

  async function handleOnSubmitPic(e) {

    if (photoPut !== null ) {
      if (Math.round((photoPut.target.files[0].size / 1024)) < 5000){
      Notify('Votre image est en cours de chargement ...', 'info')
      const res = await patchTodayCardFiles("image", photoPut.target.files[0])
      console.log("image api res:", res.status)
    setTogglePicture(true)
      setEdit(false)
      console.log("image submitted")
      return setRender(!render)
      }else{ 
    setTogglePicture(false)
      return  Notify('Votre image est trop volumineuse... <5Mb', 'error')
      }
    }
  }

  async function handleOnSubmitAudio(e) {

    if (microPut !== null) {
      if (Math.round((microPut.target.files[0].size / 1024)) < 5000) {
      Notify('Votr fichier audio est en cours de chargement ...', 'info')
      const res = await patchTodayCardFiles("audio", microPut.target.files[0])
      setEdit(false)
      console.log("audio submitted")
      return setRender(!render)

      } else {
       return Notify('Votre fichier audio est trop volumineux... <5Mb', 'error')
      }
    }}

  async function handleOnSubmitVideo(e) {

    if (videoPut !== null) {
      if (Math.round((videoPut.target.files[0].size / 1024)) < 5000) {
      Notify('Votre video est en cours de chargement ...', 'info')
      console.log("test video:",)
      const res = await patchTodayCardFiles("video", videoPut.target.files[0])
      console.log("video api res:", res.status)
      setToggleVideo(true)
      setEdit(true)
      console.log("video submitted")
      return setRender(!render)
      } else {
      setToggleVideo(false)
       return Notify('Votre video est trop volumineuse... <5Mb', 'error')
      }
    }
  }

  function textinput(e) {
    e.preventDefault()
    handleOnSubmitText()
    setToggleTextField(false)
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
      nav('/page404')
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
    } else {
      setToday(false)
    }
  }

  function hanldeDeleteCard() {
    deleteCard(cardId)
    setToggleDel(!toggleDel)
    nav('/Dashboard/calendar')
  }

  useEffect(() => {
    dayCardData()
  }, [render]);

  useEffect(() => {
    isTodayCard()
    todayCard()
  }, [dayCardData]);
  
  useEffect((e) => {
    handleOnSubmitPic()
  }, [photoPut]);

  useEffect((e) => {
    handleOnSubmitAudio()
  }, [microPut]);

  useEffect((e) => {
    handleOnSubmitVideo()
  }, [videoPut]);

  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className='card-container'>
        {isLoading ? <Spinner /> :
          <div style={labelToColor(mood)} className='card'>
            <h2>{date}</h2>
            <div className='card-medium'>
              <h3>R??sum?? de la journ??e
                {today && (<>
                  {!edit && <button className='editMode-btn' onClick={() => setEdit(true)}>
                    <FontAwesomeIcon className='editMode-btn-pencil' icon={faPencil} name="Edit" />
                  </button>}</>)}</h3>
              <div className='card-medium-infos'>
                {toggleTextField &&
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
                  <div className='card-medium-media-container'>
        
                <div onClick={() => { setToggleTextField(!toggleTextField) }} className='card-text'>  {texts}</div>
               
                  <ReactAudioPlayer
                    className="card-medium-medias-audio"
                    src={sounds}
                    controls
                  />
                

                <label >
                  <input type="file" max-size="5000" name="upload_file" onChange={setPhotoPut}>
                  </input>
                  <img onClick={() => { setTogglePicture(!togglePicture) }} className='card-user-video card-medium-medias' src={pictures} />
                </label>

                {toggleVideo && 
                <label>
                  <iframe
                    className="card-medium-medias"
                    src={videos}
                    height='500'
                    width='238'
                    frameBorder="0"
                    allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                  <input type="file" max-size="5000" name="upload_file" onChange={setVideoPut} />
                </label>
                }
              </div>
            </div>
          </div>
            {!today &&
              <button className='card-delete-modal-openModal' onClick={() => setToggleDel(!toggleDel)}>Supprimer la carte</button>
            }
          </div>
        }



        {toggleDel && <>
          <div className='card-delete-modal'>
            <p className='card-delete-modal-title'>??tes-vous s??r de vouloir supprimer cette carte ? </p>
            <div className='card-delete-modal-btn-container' >
              <button className='card-delete-modal-btn-supp' onClick={hanldeDeleteCard}>Supprimer la carte</button>
              <button className='card-delete-modal-btn-cancel' onClick={() => setToggleDel(false)}>Annuler</button>
            </div>
          </div>
        </>
        }{edit &&
          <form className='editMode' >

            <button className='editMode-btn-modal' onClick={() => setEdit(false)}>
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
                <FontAwesomeIcon onClick={() =>  setToggleTextField(!toggleTextField) } icon={faKeyboard} className="editMode-file" name="Text" />
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