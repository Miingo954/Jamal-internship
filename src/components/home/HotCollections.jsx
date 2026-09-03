import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Skeleton from "../UI/Skeleton";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";


const HOT_COLLECTIONS_URL =
  "https://us-central1-nft-cloud-functions.cloudfunctions.net/hotCollections";

const HotCollections = () => {
  const [collections, setCollections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadHotCollections() {
      try {
        const response = await fetch(HOT_COLLECTIONS_URL);

        if (!response.ok) {
          throw new Error("Unable to load hot collections.");
        }

        const data = await response.json();
        setCollections(data.slice(0, 8));
      } catch (requestError) {
        console.error("Failed to load hot collections:", requestError);
        setError("Hot collections are unavailable right now. Please try again soon.");
      } finally {
        setIsLoading(false);
      }
    }

    loadHotCollections();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 992,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 576,
        settings: { slidesToShow: 1 },
      },
    ],
  };

  return (
    <section id="section-collections" className="no-bottom">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="text-center">
              <h2>Hot Collections</h2>
              <div className="small-border bg-color-2"></div>
            </div>
          </div>
          {isLoading &&
            new Array(4).fill(0).map((_, index) => (
              <div className="col-lg-3 col-md-6 col-sm-6 col-xs-12" key={index}>
                <div className="nft_coll">
                  <Skeleton width="100%" height="240px" borderRadius="8px" />
                </div>
              </div>
            ))}

          {!isLoading && error && (
            <div className="col-12 text-center">
              <p>{error}</p>
            </div>
          )}

          {!isLoading && !error && (
            <div className="col-12">
              <Slider {...settings} className="hot-collections-carousel">
                {collections.map((collection) => (
                  <div key={collection.id} className="px-2">
                    <div className="nft_coll">
                      <div className="nft_wrap">
                        <Link to={`/item-details/${collection.id}`}>
                          <img
                            src={collection.nftImage}
                            className="lazy img-fluid"
                            alt={`${collection.title} NFT collection`}
                          />
                        </Link>
                      </div>
                      <div className="nft_coll_pp">
                        <Link to="/author">
                          <img
                            className="lazy pp-coll"
                            src={collection.authorImage}
                            alt={`${collection.title} creator`}
                          />
                        </Link>
                        <i className="fa fa-check"></i>
                      </div>
                      <div className="nft_coll_info">
                        <Link to={`/item-details/${collection.id}`}>
                          <h4>{collection.title}</h4>
                        </Link>
                        <span>ERC-{collection.code}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </Slider>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default HotCollections;
