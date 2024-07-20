const HomepageTastic = () => {
  return (
    <>
      <div className="home-wrapper container">
        <div className="grid grid-cols-2">
          <div className=" border-right">
            <h1 className="text-3xl font-bold">What are you looking for?</h1>
            <div className="bull-selector">
              <span className="text-selector">I am a</span>
              <span className="span-selector">
                <input type="radio" />
                <label htmlFor="html">Buyer</label>
              </span>
              <span className="span-selector ">
                <input type="radio" />
                <label htmlFor="html">Seller</label>
              </span>
              <span className="span-selector">
                <input type="radio" />
                <label htmlFor="html">Both</label>
              </span>
            </div>
            <div className="third-selector">
              <span className="text-selector-one"> I am looking for </span>

              <span className="span-selector">
                {/* <label htmlFor="cars">API, Exipent, Solvents</label> */}
                <select name="cars" id="cars">
                  <option value="volvo">API</option>
                  <option value="saab">Exipent</option>
                  <option value="mercedes">Solvents</option>
                </select>
              </span>
            </div>
            <div className="btn-wrap">
              <button>Submit</button>
            </div>
          </div>
          <div className="right-cont">
            <div className="mt-5 text-center">
              <img src="https://via.placeholder.com/200.png/004c4c/?text=." alt="" className="rounded" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Allverz is a platform</h1>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Reprehenderit officiis iste omnis quisquam
              aspernatur deserunt eaque, iure, cupiditate optio nemo quo accusantium nihil eos, dolores voluptatibus
              expedita magnam earum tenetur tempora neque obcaecati? Doloribus ipsa reiciendis hic eaque! Ex vitae
              dolore a cupiditate commodi dolores? Delectus dolor eaque voluptatibus eius.
            </p>
            <div className="btn-log-wrap">
              <button>Log In/Signup</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomepageTastic;
