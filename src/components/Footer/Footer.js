// src/components/Footer/Footer.js
import React from 'react';
import './Footer.css'; // Assuming you have a CSS file for Footer specific styles

const Footer = () => (
    <footer className="myapp-footer bg-gray" aria-labelledby="footer-heading">
        <h2 id="footer-heading" className="sr-only">Footer</h2>
        <div className="px-4 py-12 mx-auto max-w-7xl sm:px-6 lg:px-16">
            <div className="xl:grid xl:grid-cols-3 xl:gap-8">
                <div className="text-white xl:col-span-1">
                    <a className="text-lg font-bold tracking-tighter text-green-600 transition duration-500 ease-in-out transform tracking-relaxed lg:pr-8" href="https://www.linkedin.com/in/saeed-asle/"> developers </a>
                    <p className="w-1/2 mt-2 text-sm text-gray-500">Designed and Developed by Saeed Asle. This website was a project supervised by D. Noaa at Azrieli College of Engineering, Jerusalem.</p>
                </div>
                <div className="grid grid-cols-2 gap-8 mt-12 xl:mt-0 xl:col-span-2">
                    <div className="md:grid md:grid-cols-2 md:gap-8">
                        <div>
                            <h3 className="text-sm font-bold tracking-wider text-green-500 uppercase">Navigation</h3>
                            <ul role="list" className="mt-4 space-y-2">
                                <li>
                                    <a href="/" className="text-base font-normal text-gray-500 hover:text-green-600"> Home </a>
                                </li>
                                <li>
                                    <a href="/loginPage" className="text-base font-normal text-gray-500 hover:text-green-600"> Login </a>
                                </li>
                                <li>
                                    <a href="/Cart" className="text-base font-normal text-gray-500 hover:text-green-600"> cart </a>
                                </li>
                                <li>
                                    <a href="/ViewInventory" className="text-base font-normal text-gray-500 hover:text-green-600"> View Inventory </a>
                                </li>
                                <li>
                                    <a href="/Contact" className="text-base font-normal text-gray-500 hover:text-green-600"> contact </a>
                                </li>
                                <li>
                                    <a href="/AboutWarehouse" className="text-base font-normal text-gray-500 hover:text-green-600"> About </a>
                                </li>
                            </ul>
                        </div>
                        <div className="mt-12 md:mt-0">
                            <h3 className="text-sm font-bold tracking-wider text-green-500 uppercase">UI/UX &amp; Dev</h3>
                            <ul role="list" className="mt-4 space-y-2">
                                <li>
                                    <a href="https://www.wickedblocks.dev" className="text-base font-normal text-gray-500 hover:text-green-600"> Wickled Blocks </a>
                                </li>
                                <li>
                                    <a href="https://www.wickedbackgrounds.com/" className="text-base font-normal text-gray-500 hover:text-green-600"> Wicked Backgrounds </a>
                                </li>
                                <li>
                                    <a href="https://wickedpopups.com/" className="text-base font-normal text-gray-500 hover:text-green-600"> Wicked Popup's </a>
                                </li>
                                <li>
                                    <a href="https://www.colorsandfonts.com/.html" className="text-base font-normal text-gray-500 hover:text-green-600"> Colors &amp; Fonts </a>
                                </li>
                                <li>
                                    <a href="https://30daysoftailwindcss.com/" className="text-base font-normal text-gray-500 hover:text-green-600"> 30 Days Of Tailwind CSS</a>
                                </li>
                                <li>
                                    <a href="https://freeforcommercialuse.netlify.app/.html" className="text-base font-normal text-gray-500 hover:text-green-600"> Free For Commercial Use </a>
                                </li>
                                <li>
                                    <a href="https://www.wickedtemplates.com/" className="text-base font-normal text-gray-500 hover:text-green-600"> Wicked Templates </a>
                                </li>
                                <li>
                                    <a href="https://www.tailwindawesome.com/.html" className="text-base font-normal text-gray-500 hover:text-green-600"> Tailwind Awesome </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="md:grid md:grid-cols-2 md:gap-8">
                        <div>
                        <h3 className="text-sm font-bold tracking-wider text-green-500 uppercase">Technologies Used</h3>
                    <ul role="list" className="mt-4 space-y-2">
                        <li>
                            <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" className="text-base font-normal text-gray-500 hover:text-green-600" target="_blank" rel="noopener noreferrer">JavaScript</a>
                        </li>
                        <li>
                            <a href="https://nodejs.org/" className="text-base font-normal text-gray-500 hover:text-green-600" target="_blank" rel="noopener noreferrer">Node.js</a>
                        </li>
                        <li>
                            <a href="https://reactjs.org/" className="text-base font-normal text-gray-500 hover:text-green-600" target="_blank" rel="noopener noreferrer">React</a>
                        </li>
                        <li>
                            <a href="https://tailwindcss.com/" className="text-base font-normal text-gray-500 hover:text-green-600" target="_blank" rel="noopener noreferrer">Tailwind CSS</a>
                        </li>
                        <li>
                            <a href="https://firebase.google.com/" className="text-base font-normal text-gray-500 hover:text-green-600" target="_blank" rel="noopener noreferrer">Firebase</a>
                        </li>
                        <li>
                            <a href="https://getbootstrap.com/" className="text-base font-normal text-gray-500 hover:text-green-600" target="_blank" rel="noopener noreferrer">Bootstrap</a>
                        </li>
                        <li>
                            <a href="https://mui.com/" className="text-base font-normal text-gray-500 hover:text-green-600" target="_blank" rel="noopener noreferrer">Material UI</a>
                        </li>
                    </ul>
                        </div>
                        <div className="mt-12 md:mt-0">
                            <h3 className="text-sm font-bold tracking-wider text-green-500 uppercase">Support</h3>
                            <ul role="list" className="mt-4 space-y-2">
                                <li>
                                <a href="/contact" className="text-base font-normal text-gray-500 hover:text-green-600"> Contact </a>
                                </li>
                                <li>
                                    <a href="https://www.linkedin.com/in/saeed-asle/" className="text-base font-normal text-gray-500 hover:text-green-600"> Documentation </a>
                                </li>
                                <li>
                                    <a href="https://www.linkedin.com/in/saeed-asle/" className="text-base font-normal text-gray-500 hover:text-green-600"> Chat </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div className="pt-8 mt-12 text-gray-400 border-t border-gray-800">
                <p>© 2024 Saeed Asle. All rights reserved.</p>
            </div>
        </div>
    </footer>
);

export default Footer;
