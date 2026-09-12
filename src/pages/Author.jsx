import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import AuthorBanner from "../images/author_banner.jpg";
import AuthorItems from "../components/author/AuthorItems";
import Skeleton from "../components/UI/Skeleton";

const AUTHORS_URL =
  "https://us-central1-nft-cloud-functions.cloudfunctions.net/authors";

const AuthorSkeleton = () => (
  <main className="author-page" aria-busy="true" aria-label="Loading creator">
    <Skeleton width="100%" height="360px" borderRadius="0" />
    <div className="container author-profile-skeleton">
      <div className="d-flex align-items-center gap-3 mb-5">
        <Skeleton width="150px" height="150px" borderRadius="50%" />
        <div>
          <Skeleton width="220px" height="30px" borderRadius="5px" />
          <div className="mt-3">
            <Skeleton width="150px" height="18px" borderRadius="4px" />
          </div>
        </div>
      </div>
      <div className="row">
        {new Array(8).fill(0).map((_, index) => (
          <div className="col-lg-3 col-md-6" key={index}>
            <Skeleton width="100%" height="360px" borderRadius="15px" />
          </div>
        ))}
      </div>
    </div>
  </main>
);

const Author = () => {
  const { id } = useParams();
  const [author, setAuthor] = useState(null);
  const [isLoading, setIsLoading] = useState(Boolean(id));
  const [error, setError] = useState("");
  const [isFollowing, setIsFollowing] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);

    if (!id) {
      setIsLoading(false);
      setError("Choose a creator to view their profile.");
      return undefined;
    }

    const controller = new AbortController();

    async function loadAuthor() {
      setIsLoading(true);
      setError("");
      setAuthor(null);

      try {
        const response = await fetch(
          `${AUTHORS_URL}?author=${encodeURIComponent(id)}`,
          {
            signal: controller.signal,
            cache: "no-store",
          },
        );

        if (!response.ok) throw new Error("Unable to load this creator.");

        const data = await response.json();
        if (!data?.authorId || String(data.authorId) !== String(id)) {
          throw new Error("That creator was not found.");
        }

        const matchingAuthor = {
          ...data,
          nftCollection: Array.isArray(data.nftCollection)
            ? data.nftCollection
            : [],
        };

        setAuthor(matchingAuthor);
        setIsFollowing(
          window.localStorage.getItem(`following-author-${data.authorId}`) ===
            "true",
        );
      } catch (requestError) {
        if (requestError.name !== "AbortError") {
          setError(requestError.message);
        }
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    }

    loadAuthor();
    return () => controller.abort();
  }, [id]);

  const toggleFollow = () => {
    const nextValue = !isFollowing;
    setIsFollowing(nextValue);
    window.localStorage.setItem(
      `following-author-${author.authorId}`,
      String(nextValue),
    );
  };

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(author.address);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  if (isLoading) return <AuthorSkeleton />;

  if (error || !author) {
    return (
      <main className="container author-error">
        <h1>Creator unavailable</h1>
        <p>{error || "That creator could not be found."}</p>
        <Link to="/explore" className="btn-main">
          Explore creators
        </Link>
      </main>
    );
  }

  return (
    <div id="wrapper">
      <div className="no-bottom no-top" id="content">
        <div id="top"></div>

        <section
          id="profile_banner"
          aria-label={`${author.authorName} profile banner`}
          className="text-light"
          style={{ background: `url(${AuthorBanner}) top` }}
        ></section>

        <section aria-label={`${author.authorName} creator profile`}>
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <div className="d_profile de-flex">
                  <div className="de-flex-col">
                    <div className="profile_avatar">
                      <img
                        src={author.authorImage}
                        alt={author.authorName}
                        loading="lazy"
                      />
                      <i className="fa fa-check"></i>
                      <div className="profile_name">
                        <h4>
                          {author.authorName}
                          <span className="profile_username">
                            @{author.tag}
                          </span>
                          <span id="wallet" className="profile_wallet">
                            {author.address}
                          </span>
                          <button
                            id="btn_copy"
                            type="button"
                            onClick={copyAddress}
                            title="Copy wallet address"
                          >
                            {copied ? "Copied" : "Copy"}
                          </button>
                        </h4>
                      </div>
                    </div>
                  </div>

                  <div className="profile_follow de-flex">
                    <div className="de-flex-col">
                      <div className="profile_follower">
                        {author.followers + (isFollowing ? 1 : 0)} followers
                      </div>
                      <button
                        type="button"
                        className="btn-main"
                        onClick={toggleFollow}
                        aria-pressed={isFollowing}
                      >
                        {isFollowing ? "Following" : "Follow"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-12">
                <div className="de_tab tab_simple">
                  <AuthorItems author={author} />
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
