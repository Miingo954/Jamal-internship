import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Skeleton from "../UI/Skeleton";
import NftItem from "../UI/NftItem";

const NEW_ITEMS_URL =
  "https://us-central1-nft-cloud-functions.cloudfunctions.net/newItems";

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
          setError(
            "New items are unavailable right now. Please try again soon.",
          );
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
              <Slider
                {...settings}
                className="hot-collections-carousel new-items-carousel"
              >
                {items.map((item) => (
                  <div key={item.id} className="px-2">
                    <NftItem item={item} source="new" />
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
