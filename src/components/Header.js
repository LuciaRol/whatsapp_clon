import React from 'react';
import io from 'socket.io-client';
import gatoSurprise from '../img/surprise.png';

function Header() {
    return (
        <div className="header">
            <div className="header__left">
                <img
                    className="header__logo"
                    src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
                    alt="logo de gato"
                />
                <h3 className="header__title">Chatt-ON!</h3>
            </div>
            <div className="header__center">
                <a className="header__center__a">Iniciar sesión</a>
                <a className="header__center__a">Cerrar sesión</a>
            </div>
            <div className="header__right">
                <img
                    className="header__logo"
                    src={gatoSurprise}
                    alt="logo de gato"
                />
            </div>
        </div>
    );
}

export default Header;
