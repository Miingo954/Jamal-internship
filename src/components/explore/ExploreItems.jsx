import React, { useEffect, useState } from "react";
import NftItem from "../UI/NftItem";
import Skeleton from "../UI/Skeleton";

const EXPLORE_URL =
  "https://us-central1-nft-cloud-functions.cloudfunctions.net/explore";
const INITIAL_ITEM_COUNT = 8;
const LOAD_MORE_COUNT = 4;

const FILTERS = [
  { value: "", label: "Default" },
  { value: "price_low_to_high", label: "Price, Low to High" },
  { value: "price_high_to_low", label: "Price, High to Low" },
  { value: "likes_high_to_low", label: "Most Liked" },
];

const ExploreSkeletons = () =>
  new Array(INITIAL_ITEM_COUNT).fill(0).map((_, index) => (
    <div
      className="d-item explore-item col-lg-3 col-md-6 col-sm-6 col-xs-12"
      key={index}
    >
      <div className="nft__item" aria-hidden="true">
        <Skeleton width="100%" height="350px" borderRadius="8px" />
        <div className="mt-3">
          <Skeleton width="72%" height="18px" borderRadius="4px" />
        </div>
        <div className="mt-2">
          <Skeleton width="42%" height="14px" borderRadius="4px" />
        </div>
      </div>
    </div>
  ));

const ExploreItems = () => {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState("");
  const [visibleCount, setVisibleCount] = useState(INITIAL_ITEM_COUNT);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadExploreItems() {
      setIsLoading(true);
      setError("");
      setVisibleCount(INITIAL_ITEM_COUNT);

      try {
        const url = filter ? `${EXPLORE_URL}?filter=${filter}` : EXPLORE_URL;
        const response = await fetch(url, { signal: controller.signal });

        if (!response.ok) {
          throw new Error("Unable to load the marketplace.");
        }

        const data = await response.json();
        setItems(data);
      } catch (requestError) {
        if (requestError.name !== "AbortError") {
          console.error("Failed to load explore items:", requestError);
          setError(
            "The marketplace is unavailable right now. Please try again.",
          );
        }
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    }

    loadExploreItems();
    return () => controller.abort();
  }, [filter]);

  const visibleItems = items.slice(0, visibleCount);
  const hasMoreItems = visibleCount < items.length;

  return (
    <>
      <div className="col-12 explore-toolbar">
        <label htmlFor="filter-items">Sort marketplace</label>
        <select
          id="filter-items"
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
          disabled={isLoading}
        >
          {FILTERS.map((option) => (
            <option key={option.value || "default"} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {isLoading && <ExploreSkeletons />}

      {!isLoading && error && (
        <div className="col-12 text-center explore-message" role="alert">
          <p>{error}</p>
        </div>
      )}

      {!isLoading &&
        !error &&
        visibleItems.map((item) => (
          <div
            key={item.id}
            className="d-item explore-item col-lg-3 col-md-6 col-sm-6 col-xs-12"
          >
            <NftItem item={item} source="explore" />
          </div>
        ))}

      {!isLoading && !error && hasMoreItems && (
        <div className="col-md-12 text-center">
          <button
            type="button"
            id="loadmore"
            className="btn-main lead"
            onClick={() => setVisibleCount((count) => count + LOAD_MORE_COUNT)}
          >
            Load more
          </button>
        </div>
      )}
    </>
  );
};

export default ExploreItems;
