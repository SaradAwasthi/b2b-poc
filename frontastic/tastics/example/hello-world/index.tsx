import React from 'react';

const HelloWorldTastic = () => {
  return (
<>
      <div className="body-wrapper">
          <section className="myScrollSec">
              <div className="container">
                  <div className="row">
                      <div className="col-12 whoWeHead">
                          <h2>Who we are</h2>
                      </div>
                      <div className="col-12 myScroll">
                          <div className="scrollItems">
                              <img alt="Portfolio of 150+ APIs" src="https://api.drreddys.com/themes/custom/reddy/images/s1.webp" loading="lazy"/>
                                  <div className="textArea">
                                      <p><span>                     Portfolio of 150+ APIs
                                      </span>
                                          <button className="homeReadBtn">Explore More</button>
                                      </p>
                                  </div>
                          </div>
                          <div className="scrollItems" >
                              <img alt="Global manufacturing network of 8 sites" src="https://api.drreddys.com/themes/custom/reddy/images/s2.webp" loading="lazy"/>
                                  <div className="textArea">
                                      <p><span>               Global manufacturing network of 8 sites
                                      </span>
                                          <button className="homeReadBtn">Know More</button>
                                      </p>
                                  </div>
                          </div>
                          <div className="scrollItems">
                              <img alt="Strong R&amp;D capabilities" src="https://api.drreddys.com/themes/custom/reddy/images/s3.webp" loading="lazy"/>
                                  <div className="textArea">
                                      <p><span>               Strong R&amp;D capabilities
                                      </span>

                                          <button className="homeReadBtn">Know More</button>
                                      </p>
                                  </div>
                          </div>
                      </div>


                  </div>
              </div>
          </section>
          <section className='block-slider'>

          </section>
      </div>
  </>
  ) 
};

export default HelloWorldTastic;
