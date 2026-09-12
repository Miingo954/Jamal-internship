import React, { useEffect, useState } from "react";
import EthImage from "../images/ethereum.svg";
import { Link, useParams } from "react-router-dom";
import AuthorImage from "../images/author_thumbnail.jpg";
import nftImage from "../images/nftImage.jpg";
import Skeleton from "../components/UI/Skeleton";

const HOT_COLLECTIONS_URL =
  "https://us-central1-nft-cloud-functions.cloudfunctions.net/hotCollections";
const NEW_ITEMS_URL =
  "https://us-central1-nft-cloud-functions.cloudfunctions.net/newItems";
const EXPLORE_URL =
  "https://us-central1-nft-cloud-functions.cloudfunctions.net/explore";
const AUTHORS_URL =
  "https://us-central1-nft-cloud-functions.cloudfunctions.net/authors";

const fallbackCollection = {
  title: "Rainbow Style #194",
  nftImage,
  authorImage: AuthorImage,
  nftId: "—",
  authorId: "Monica Lucas",
  code: 194,
};

const ItemDetailsSkeleton = () => (
  <div id="wrapper" aria-label="Loading NFT collection" aria-busy="true">
    <div className="no-bottom no-top" id="content">
      <div id="top"></div>
      <section aria-label="Loading collection details" className="mt90 sm-mt-0">
        <div className="container">
          <div className="row">
            <div className="col-md-6 text-center">
              <Skeleton width="100%" height="460px" borderRadius="12px" />
            </div>
            <div className="col-md-6 mt-4 mt-md-0">
              <Skeleton width="75%" height="52px" borderRadius="8px" />
              <div className="mt-4 d-flex gap-3">
                <Skeleton width="120px" height="24px" borderRadius="999px" />
                <Skeleton width="100px" height="24px" borderRadius="999px" />
              </div>
              <div className="mt-4">
                <Skeleton width="100%" height="18px" borderRadius="6px" />
                <Skeleton width="92%" height="18px" borderRadius="6px" />
                <Skeleton width="66%" height="18px" borderRadius="6px" />
              </div>
              <div className="mt-5 d-flex gap-3 align-items-center">
                <Skeleton width="56px" height="56px" borderRadius="50%" />
                <Skeleton width="180px" height="22px" borderRadius="6px" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
);

const ItemDetails = () => {
  const { authorId, id, type } = useParams();
  const isNewItem = type === "new";
  const isExploreItem = type === "explore";
  const isAuthorItem = Boolean(authorId);
  const [collection, setCollection] = useState(id ? null : fallbackCollection);
  const [isLoading, setIsLoading] = useState(Boolean(id));
  const [error, setError] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);

    if (!id) {
      setCollection(fallbackCollection);
      setIsLoading(false);
      return;
    }

    let isCurrent = true;

    async function loadItem() {
      setIsLoading(true);
      setCollection(null);
      setError("");

      try {
        const endpoint = isAuthorItem
          ? `${AUTHORS_URL}?author=${authorId}`
          : isExploreItem
            ? EXPLORE_URL
            : isNewItem
              ? NEW_ITEMS_URL
              : HOT_COLLECTIONS_URL;
        const response = await fetch(endpoint, { cache: "no-store" });

        if (!response.ok) {
          throw new Error(
            `Unable to load this ${isNewItem ? "item" : "collection"}.`,
          );
        }

        const data = await response.json();
        if (
          isAuthorItem &&
          (!data?.authorId || String(data.authorId) !== String(authorId))
        ) {
          throw new Error("That creator was not found.");
        }

        const matchingItem = isAuthorItem
          ? data.nftCollection
              ?.filter((apiItem) => String(apiItem.id) === id)
              .map((apiItem) => ({
                ...apiItem,
                authorId: data.authorId,
                authorImage: data.authorImage,
                authorName: data.authorName,
              }))[0]
          : data.find((apiItem) => String(apiItem.id) === id);

        if (!matchingItem) {
          throw new Error(
            `That ${isNewItem ? "item" : "collection"} was not found.`,
          );
        }

        if (isCurrent) {
          setCollection(matchingItem);
        }
      } catch (requestError) {
        if (isCurrent) {
          setError(requestError.message);
        }
      } finally {
        if (isCurrent) {
          setIsLoading(false);
        }
      }
    }

    loadItem();

    return () => {
      isCurrent = false;
    };
  }, [authorId, id, isAuthorItem, isExploreItem, isNewItem]);

  if (isLoading) {
    return <ItemDetailsSkeleton />;
  }

  if (error || !collection) {
    return (
      <main className="container pt-5">
        <p>{error || "That collection could not be found."}</p>
        <Link to="/">Back to home</Link>
      </main>
    );
  }

  return (
    <div id="wrapper">
      <div className="no-bottom no-top" id="content">
        <div id="top"></div>
        <section aria-label="section" className="mt90 sm-mt-0">
          <div className="container">
            <div className="row">
              <div className="col-md-6 text-center">
                <img
                  src={collection.nftImage}
                  className="img-fluid img-rounded mb-sm-30 nft-image"
                  alt={`${collection.title} NFT collection`}
                  loading="lazy"
                />
              </div>
              <div className="col-md-6">
                <div className="item_info">
                  <h2>{collection.title}</h2>

                  <div className="item_info_counts">
                    <div className="item_info_views">
                      <i className="fa fa-eye"></i>
                      NFT #{collection.nftId}
                    </div>
                    <div className="item_info_like">
                      <i className="fa fa-heart"></i>
                      {isNewItem || isExploreItem || isAuthorItem
                        ? `${collection.likes} likes`
                        : `ERC-${collection.code}`}
                    </div>
                  </div>
                  <p>
                    Explore {collection.title}. This page is populated from the
                    selected{" "}
                    {isAuthorItem
                      ? "Author collection"
                      : isExploreItem
                        ? "Explore"
                        : isNewItem
                          ? "New Items"
                          : "Hot Collections"}{" "}
                    API record.
                  </p>
                  <div className="d-flex flex-row">
                    <div className="mr40">
                      <h6>Owner</h6>
                      <div className="item_author">
                        <div className="author_list_pp">
                          <Link to={`/author/${collection.authorId}`}>
                            <img
                              className="lazy"
                              src={collection.authorImage}
                              alt={`${collection.title} creator`}
                              loading="lazy"
                            />
                            <i className="fa fa-check"></i>
                          </Link>
                        </div>
                        <div className="author_list_info">
                          <Link to={`/author/${collection.authorId}`}>
                            {collection.authorName ||
                              `Creator #${collection.authorId}`}
                          </Link>
                        </div>
                      </div>
                    </div>
                    <div></div>
                  </div>
                  <div className="de_tab tab_simple">
                    <div className="de_tab_content">
                      <h6>Creator</h6>
                      <div className="item_author">
                        <div className="author_list_pp">
                          <Link to={`/author/${collection.authorId}`}>
                            <img
                              className="lazy"
                              src={collection.authorImage}
                              alt={`${collection.title} creator`}
                              loading="lazy"
                            />
                            <i className="fa fa-check"></i>
                          </Link>
                        </div>
                        <div className="author_list_info">
                          <Link to={`/author/${collection.authorId}`}>
                            {collection.authorName ||
                              `Creator #${collection.authorId}`}
                          </Link>
                        </div>
                      </div>
                    </div>
                    <div className="spacer-40"></div>
                    <h6>Price</h6>
                    <div className="nft-item-price">
                      <img src={EthImage} alt="" />
                      <span>
                        {isNewItem || isExploreItem || isAuthorItem
                          ? `${Number(collection.price).toFixed(2)} ETH`
                          : `Collection #${collection.code}`}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ItemDetails;
