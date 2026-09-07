import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Skeleton from "../UI/Skeleton";

const NEW_ITEMS_URL =
  "https://us-central1-nft-cloud-functions.cloudfunctions.net/newItems";

const formatTimeLeft = (expiryDate) => {
  const remaining = Math.max(0, Number(expiryDate) - Date.now());
  const totalSeconds = Math.floor(remaining / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return days > 0
    ? `${days}d ${hours}h ${minutes}m`
    : `${hours}h ${minutes}m ${seconds}s`;
};

const Countdown = ({ expiryDate }) => {
  const [timeLeft, setTimeLeft] = useState(() => formatTimeLeft(expiryDate));

  useEffect(() => {
    const updateCountdown = () => setTimeLeft(formatTimeLeft(expiryDate));
    const timerId = window.setInterval(updateCountdown, 1000);

    return () => window.clearInterval(timerId);
  }, [expiryDate]);

  return <div className="de_countdown">{timeLeft}</div>;
};

const NewItems = () => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadNewItems() {
      try {
        const response = await fetch(NEW_ITEMS_URL, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Unable to load new items.");
        }

        const data = await response.json();
        setItems(data);
      } catch (requestError) {
        if (requestError.name !== "AbortError") {
          console.error("Failed to load new items:", requestError);
          setError("New items are unavailable right now. Please try again soon.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    loadNewItems();

    return () => controller.abort();
  }, []);

  const settings = {
    dots: true,
    infinite: items.length > 4,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 992, settings: { slidesToShow: 2 } },
      { breakpoint: 576, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <section id="section-items" className="no-bottom">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="text-center">
              <h2>New Items</h2>
              <div className="small-border bg-color-2"></div>
            </div>
          </div>

          {isLoading &&
            new Array(4).fill(0).map((_, index) => (
              <div className="col-lg-3 col-md-6 col-sm-6 col-xs-12" key={index}>
                <div className="nft__item">
                  <Skeleton width="100%" height="300px" borderRadius="8px" />
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
              <Slider {...settings} className="hot-collections-carousel new-items-carousel">
                {items.map((item) => (
                  <div key={item.id} className="px-2">
                    <div className="nft__item">
                      <div className="author_list_pp">
                        <Link
                          to={`/author/new/${item.authorId}`}
                          data-bs-toggle="tooltip"
                          data-bs-placement="top"
                          title={`Creator #${item.authorId}`}
                        >
                          <img
                            className="lazy"
                            src={item.authorImage}
                            alt={`Creator of ${item.title}`}
                          />
                          <i className="fa fa-check"></i>
                        </Link>
                      </div>

                      {item.expiryDate && <Countdown expiryDate={item.expiryDate} />}

                      <div className="nft__item_wrap">
                        <div className="nft__item_extra">
                          <div className="nft__item_buttons">
                            <button type="button">Buy Now</button>
                            <div className="nft__item_share">
                              <h4>Share</h4>
                            </div>
                          </div>
                        </div>

                        <Link to={`/item-details/new/${item.id}`}>
                          <img
                            src={item.nftImage}
                            className="lazy nft__item_preview"
                            alt={`${item.title} NFT`}
                          />
                        </Link>
                      </div>

                      <div className="nft__item_info">
                        <Link to={`/item-details/new/${item.id}`}>
                          <h4>{item.title}</h4>
                        </Link>
                        <div className="nft__item_price">
                          {Number(item.price).toFixed(2)} ETH
                        </div>
                        <div className="nft__item_like">
                          <i className="fa fa-heart"></i>
                          <span>{item.likes}</span>
                        </div>
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

export default NewItems;
