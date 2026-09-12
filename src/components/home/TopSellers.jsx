import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Skeleton from "../UI/Skeleton";

const TOP_SELLERS_URL =
  "https://us-central1-nft-cloud-functions.cloudfunctions.net/topSellers";

const TopSellers = () => {
  const [sellers, setSellers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadTopSellers() {
      try {
        const response = await fetch(TOP_SELLERS_URL, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Unable to load top sellers.");
        }

        setSellers(await response.json());
      } catch (requestError) {
        if (requestError.name !== "AbortError") {
          console.error("Failed to load top sellers:", requestError);
          setError(
            "Top sellers are unavailable right now. Please try again soon.",
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    loadTopSellers();
    return () => controller.abort();
  }, []);

  return (
    <section id="section-popular" className="pb-5">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="text-center">
              <h2>Top Sellers</h2>
              <div className="small-border bg-color-2"></div>
            </div>
          </div>
          <div className="col-md-12">
            <ol className="author_list">
              {isLoading &&
                new Array(12).fill(0).map((_, index) => (
                  <li key={index} aria-hidden="true">
                    <div className="author_list_pp">
                      <Skeleton width="50px" height="50px" borderRadius="50%" />
                    </div>
                    <div className="author_list_info">
                      <Skeleton
                        width="120px"
                        height="16px"
                        borderRadius="4px"
                      />
                      <div className="mt-2">
                        <Skeleton
                          width="65px"
                          height="14px"
                          borderRadius="4px"
                        />
                      </div>
                    </div>
                  </li>
                ))}

              {!isLoading && error && (
                <li className="w-100">
                  <p>{error}</p>
                </li>
              )}

              {!isLoading &&
                !error &&
                sellers.map((seller) => (
                  <li key={seller.id}>
                    <div className="author_list_pp">
                      <Link to={`/author/${seller.authorId}`}>
                        <img
                          className="lazy pp-author"
                          src={seller.authorImage}
                          alt={seller.authorName}
                          loading="lazy"
                        />
                        <i className="fa fa-check"></i>
                      </Link>
                    </div>
                    <div className="author_list_info">
                      <Link to={`/author/${seller.authorId}`}>
                        {seller.authorName}
                      </Link>
                      <span>{Number(seller.price).toFixed(2)} ETH</span>
                    </div>
                  </li>
                ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TopSellers;
