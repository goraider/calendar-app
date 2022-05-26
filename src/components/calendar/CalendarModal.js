import React, { useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { uiCloseModal } from '../../actions/ui';
import { eventAddNew } from '../../actions/events';

import Modal from 'react-modal';
import moment from 'moment';
import DateTimePicker from 'react-datetime-picker';
import Swal from 'sweetalert2';

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
    },
};
Modal.setAppElement('#root');

const now = moment().minutes(0).seconds(0).add(1, 'hours');
const nowPlus = now.clone().add(1, 'hours');

export const CalendarModal = () => {

    const dispatch = useDispatch();
    const { modalOpen } = useSelector( state => state.ui );

    const [ dateStart, setDateStart ] = useState( now.toDate() );
    const [ dateEnd, setDateEnd ] = useState( nowPlus.toDate() );
    const [ titleValid, setTitleValid ] = useState(true);
    //const [isOpen, setIsOpen] = useState(true);

    const [ formValues, setFormValues ] = useState({
        
        title: 'Evento',
        notes: '',
        start:now.toDate(),
        end: nowPlus.toDate()

    });

    const { notes, title, start, end } = formValues;

    const handleInputChange = ({ target }) =>{

        console.log("target??",target);
        setFormValues({
            ...formValues,
            [target.name] : target.value
        });
    }

    const closeModal = () => {
        //setIsOpen( false );
        //TODO: Cerrar modal;
        dispatch( uiCloseModal() );
        console.log('cerrar modal');

    }

    const handleStartDateChange = (e) => {
        console.log(e);
        setDateStart(e);
        setFormValues({
            ...formValues,
            start: e
        });
    }
    const handleEndDateChange = (e) => {
        console.log(e);
        setDateEnd(e);
        setFormValues({
            ...formValues,
            end: e
        });
    }
    const handleSubmitForm = (e) => {
        e.preventDefault();
        console.log( formValues );

        const momentStart = moment( start );
        const momentEnd = moment( end );

        if( momentStart.isSameOrAfter( momentEnd ) ){
            return Swal.fire('Error','Fecha 2 debe ser mayor');
        }

        if( title.trim().length < 2 ){
            return setTitleValid(false);
        }

        //TODO: Guardar
        dispatch( eventAddNew({
           ...formValues,
           id: new Date().getTime(),
           user: {
               _id: '123',
               name: 'Fernando'
           }
        }) );

        console.log("wtf",formValues);

        setTitleValid(true);
        closeModal();

    }
  return (
    <Modal
        isOpen={ modalOpen }
        //isOpen={ isOpen }
        //onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        closeTimeoutMS={ 200 }
        className="modal"
        overlayClassName="modal-fondo"
    >
        <h1> Nuevo evento </h1>
        <hr />
        <form 
            className="container"
            onSubmit={ handleSubmitForm }
        >

            <div className="form-group">
                <label>Fecha y hora Inicio</label>
                <DateTimePicker
                    onChange={ handleStartDateChange }
                    value={ dateStart }
                    className="form-control"
                />
            </div>

            <div className="form-group">
                <label>Fecha y hora Fin</label>
                <DateTimePicker
                    onChange={ handleEndDateChange }
                    value={ dateEnd }
                    minDate={ dateStart }
                    className="form-control"
                />
            </div>

            <hr />
            <div className="form-group">
                <label>Titulo y notas</label>
                <input 
                    type="text" 
                    className={ `form-control ${ !titleValid && 'is-invalid'} ` }
                    placeholder="Título del evento"
                    name="title"
                    value={ title }
                    onChange={ handleInputChange }
                    autoComplete="off"
                />
                <small id="emailHelp" className="form-text text-muted">Una descripción corta</small>
            </div>

            <div className="form-group">
                <textarea 
                    type="text" 
                    className="form-control"
                    placeholder="Notas"
                    rows="5"
                    name="notes"
                    value={ notes }
                    onChange={ handleInputChange }
                ></textarea>
                <small id="emailHelp" className="form-text text-muted">Información adicional</small>
            </div>

            <button
                type="submit"
                className="btn btn-outline-primary btn-block"
            >
                <i className="far fa-save"></i>
                <span> Guardar</span>
            </button>

        </form>
    </Modal>
  )
}
