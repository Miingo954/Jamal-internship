import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import EthImage from "../images/ethereum.svg";
import AuthorImage from "../images/author_thumbnail.jpg";
import nftImage from "../images/nftImage.jpg";
import Skeleton from "../components/UI/Skeleton";

const ITEM_DETAILS_URL =
  "https://us-central1-nft-cloud-functions.cloudfunctions.net/itemDetails";

const fallbackItem = {
  title: "Rainbow Style #194",
  description: "Select an NFT to see its complete details.",
  nftImage,
  nftId: "—",
  ownerId: "",
  ownerName: "Monica Lucas",
  ownerImage: AuthorImage,
  creatorId: "",
  creatorName: "Monica Lucas",
  creatorImage: AuthorImage,
  price: 0,
  likes: 0,
  views: 0,
};

const ItemDetailsSkeleton = () => (
  <div id="wrapper" aria-label="Loading NFT details" aria-busy="true">
    <div className="no-bottom no-top" id="content">
      <div id="top"></div>
      <section aria-label="Loading NFT details" className="mt90 sm-mt-0">
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

const PersonDetails = ({ label, id, image, name }) => {
  const profilePath = id ? `/author/${id}` : null;

  return (
    <div className="mr40">
      <h6>{label}</h6>
      <div className="item_author">
        <div className="author_list_pp">
          {profilePath ? (
            <Link to={profilePath} aria-label={`View ${name}'s profile`}>
              <img className="lazy" src={image} alt={name} loading="lazy" />
              <i className="fa fa-check"></i>
            </Link>
          ) : (
            <>
              <img className="lazy" src={image} alt={name} loading="lazy" />
              <i className="fa fa-check"></i>
            </>
          )}
        </div>
        <div className="author_list_info">
          {profilePath ? <Link to={profilePath}>{name}</Link> : name}
        </div>
      </div>
    </div>
  );
};

const ItemDetails = () => {
  const { id } = useParams();
  const [item, setItem] = useState(id ? null : fallbackItem);
  const [isLoading, setIsLoading] = useState(Boolean(id));
  const [error, setError] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);

    if (!id) {
      setItem(fallbackItem);
      setIsLoading(false);
      return undefined;
    }

    const controller = new AbortController();

    async function loadItem() {
      setIsLoading(true);
      setItem(null);
      setError("");

      try {
        const response = await fetch(
          `${ITEM_DETAILS_URL}?nftId=${encodeURIComponent(id)}`,
          { signal: controller.signal, cache: "no-store" },
        );

        if (!response.ok) throw new Error("Unable to load this NFT.");

        const data = await response.json();
        if (!data?.nftId || String(data.nftId) !== String(id)) {
          throw new Error("That NFT was not found.");
        }

        setItem(data);
      } catch (requestError) {
        if (requestError.name !== "AbortError") {
          setError(requestError.message);
        }
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    }

    loadItem();
    return () => controller.abort();
  }, [id]);

  if (isLoading) return <ItemDetailsSkeleton />;

  if (error || !item) {
    return (
      <main className="container pt-5">
        <h1>NFT unavailable</h1>
        <p>{error || "That NFT could not be found."}</p>
        <Link to="/explore">Back to explore</Link>
      </main>
    );
  }

  return (
    <div id="wrapper">
      <div className="no-bottom no-top" id="content">
        <div id="top"></div>
        <section
          aria-label={`${item.title} NFT details`}
          className="mt90 sm-mt-0"
        >
          <div className="container">
            <div className="row">
              <div className="col-md-6 text-center">
                <img
                  src={item.nftImage}
                  className="img-fluid img-rounded mb-sm-30 nft-image"
                  alt={`${item.title} NFT`}
                  loading="lazy"
                />
              </div>

              <div className="col-md-6">
                <div className="item_info">
                  <h2>{item.title}</h2>

                  <div className="item_info_counts">
                    <div className="item_info_views">
                      <i className="fa fa-eye"></i>
                      {item.views} views
                    </div>
                    <div className="item_info_like">
                      <i className="fa fa-heart"></i>
                      {item.likes} likes
                    </div>
                  </div>

                  <p>{item.description}</p>
                  <p className="mb-4">
                    NFT #{item.nftId} · Collection #{item.tag}
                  </p>

                  <div className="d-flex flex-row flex-wrap">
                    <PersonDetails
                      label="Owner"
                      id={item.ownerId}
                      image={item.ownerImage}
                      name={item.ownerName}
                    />
                    <PersonDetails
                      label="Creator"
                      id={item.creatorId}
                      image={item.creatorImage}
                      name={item.creatorName}
                    />
                  </div>

                  <div className="de_tab tab_simple">
                    <div className="spacer-40"></div>
                    <h6>Price</h6>
                    <div className="nft-item-price">
                      <img src={EthImage} alt="" />
                      <span>{Number(item.price).toFixed(2)} ETH</span>
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
