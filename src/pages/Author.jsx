import React, { useEffect, useState } from "react";
import AuthorBanner from "../images/author_banner.jpg";
import AuthorItems from "../components/author/AuthorItems";
import { Link, useParams } from "react-router-dom";
import AuthorImage from "../images/author_thumbnail.jpg";
import Skeleton from "../components/UI/Skeleton";

const NEW_ITEMS_URL =
  "https://us-central1-nft-cloud-functions.cloudfunctions.net/newItems";
const HOT_COLLECTIONS_URL =
  "https://us-central1-nft-cloud-functions.cloudfunctions.net/hotCollections";
const TOP_SELLERS_URL =
  "https://us-central1-nft-cloud-functions.cloudfunctions.net/topSellers";

const Author = () => {
  const { id, type } = useParams();
  const isNewItemAuthor = type === "new" && Boolean(id);
  const isTopSeller = type === "top" && Boolean(id);
  const [authorItem, setAuthorItem] = useState(null);
  const [authorItems, setAuthorItems] = useState(null);
  const [isLoading, setIsLoading] = useState(isNewItemAuthor || isTopSeller);
  const [error, setError] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);

    if (!isNewItemAuthor && !isTopSeller) {
      setIsLoading(false);
      return undefined;
    }

    const controller = new AbortController();

    async function loadAuthor() {
      try {
        if (isTopSeller) {
          const responses = await Promise.all([
            fetch(TOP_SELLERS_URL, { signal: controller.signal }),
            fetch(NEW_ITEMS_URL, { signal: controller.signal }),
            fetch(HOT_COLLECTIONS_URL, { signal: controller.signal }),
          ]);

          if (responses.some((response) => !response.ok)) {
            throw new Error("Unable to load this creator.");
          }

          const [sellers, newItems, collections] = await Promise.all(
            responses.map((response) => response.json())
          );
          const seller = sellers.find((record) => String(record.authorId) === id);

          if (!seller) {
            throw new Error("That creator was not found.");
          }

          setAuthorItem(seller);
          setAuthorItems([
            ...newItems
              .filter((record) => String(record.authorId) === id)
              .map((record) => ({ ...record, itemType: "new" })),
            ...collections
              .filter((record) => String(record.authorId) === id)
              .map((record) => ({ ...record, itemType: "collection" })),
          ]);
          return;
        }

        const response = await fetch(NEW_ITEMS_URL, { signal: controller.signal });
        if (!response.ok) throw new Error("Unable to load this creator.");

        const items = await response.json();
        const matchingItem = items.find((item) => String(item.authorId) === id);

        if (!matchingItem) {
          throw new Error("That creator was not found.");
        }

        setAuthorItem(matchingItem);
      } catch (requestError) {
        if (requestError.name !== "AbortError") {
          setError(requestError.message);
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    loadAuthor();
    return () => controller.abort();
  }, [id, isNewItemAuthor, isTopSeller]);

  if (isLoading) {
    return (
      <main className="container mt90">
        <Skeleton width="100%" height="360px" borderRadius="8px" />
      </main>
    );
  }

  if (error) {
    return (
      <main className="container mt90">
        <p>{error}</p>
        <Link to="/">Back to home</Link>
      </main>
    );
  }

  const profileImage = authorItem?.authorImage || AuthorImage;
  const displayName = authorItem?.authorName || (authorItem ? `Creator #${authorItem.authorId}` : "Monica Lucas");
  const username = authorItem
    ? `@${(authorItem.authorName || `creator${authorItem.authorId}`)
        .toLowerCase()
        .replace(/\s+/g, "")}`
    : "@monicaaaa";
  const wallet = authorItem
    ? `NFT creator ID ${authorItem.authorId}`
    : "UDHUHWudhwd78wdt7edb32uidbwyuidhg7wUHIFUHWewiqdj87dy7";

  return (
    <div id="wrapper">
      <div className="no-bottom no-top" id="content">
        <div id="top"></div>

        <section
          id="profile_banner"
          aria-label="Creator profile banner"
          className="text-light"
          style={{ background: `url(${AuthorBanner}) top` }}
        ></section>

        <section aria-label="Creator profile">
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <div className="d_profile de-flex">
                  <div className="de-flex-col">
                    <div className="profile_avatar">
                      <img src={profileImage} alt={displayName} />
                      <i className="fa fa-check"></i>
                      <div className="profile_name">
                        <h4>
                          {displayName}
                          <span className="profile_username">{username}</span>
                          <span id="wallet" className="profile_wallet">{wallet}</span>
                          <button id="btn_copy" type="button" title="Copy Text">Copy</button>
                        </h4>
                      </div>
                    </div>
                  </div>
                  <div className="profile_follow de-flex">
                    <div className="de-flex-col">
                      <div className="profile_follower">573 followers</div>
                      <Link to="#" className="btn-main">Follow</Link>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-12">
                <div className="de_tab tab_simple">
                  <AuthorItems item={authorItem} items={authorItems} />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Author;
