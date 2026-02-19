import React from 'react';
import { Heart } from 'lucide-react';
import './Footer.css';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="paisa-footer">
            <div className="container">




                <div className="footer-bottom">
                    <div className="attribution">
                        <p>Created by <span className="highlight">Sanmaya</span></p>
                        <span className="separator">•</span>
                        <div className="made-with">
                            <span>Made with</span>
                            <Heart size={14} className="heart-icon" />
                            <span>in React</span>
                        </div>
                    </div>

                    <div className="legal">
                        <p>&copy; {currentYear} Paise Bachaaoo. All rights reserved.</p>
                        <div className="status-indicator">
                            <div className="pulse-dot"></div>
                            <span>Vault Secure</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
