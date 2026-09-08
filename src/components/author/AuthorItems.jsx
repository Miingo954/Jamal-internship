import React from "react";
import { Link } from "react-router-dom";
import AuthorImage from "../../images/author_thumbnail.jpg";
import nftImage from "../../images/nftImage.jpg";

const fallbackItem = {
  id: "fallback",
  title: "Pinky Ocean",
  price: 2.52,
  likes: 97,
  authorImage: AuthorImage,
  nftImage,
};

const AuthorItems = ({ item, items: profileItems }) => {
  const items = profileItems
    ? profileItems
    : item
    ? [{ ...item, itemType: "new" }]
    : new Array(8).fill(null).map((_, index) => ({
        ...fallbackItem,
        id: `fallback-${index}`,
      }));

  return (
    <div className="de_tab_content">
      <div className="tab-1">
        <div className="row">
          {items.length === 0 && (
            <div className="col-12 text-center">
              <p>This creator has no listed work right now.</p>
            </div>
          )}

          {items.map((authorItem) => {
            const itemRoute = authorItem.itemType
              ? `/item-details/${authorItem.itemType}/${authorItem.id}`
              : "/item-details";

            return (
              <div className="col-lg-3 col-md-6 col-sm-6 col-xs-12" key={authorItem.id}>
                <div className="nft__item">
                  <div className="author_list_pp">
                    <img
                      className="lazy"
                      src={authorItem.authorImage}
                      alt={`Creator of ${authorItem.title}`}
                    />
                    <i className="fa fa-check"></i>
                  </div>

                  <div className="nft__item_wrap">
                    <div className="nft__item_extra">
                      <div className="nft__item_buttons">
                        <button type="button">Buy Now</button>
                        <div className="nft__item_share">
                          <h4>Share</h4>
                        </div>
                      </div>
                    </div>
                    <Link to={itemRoute}>
                      <img
                        src={authorItem.nftImage}
                        className="lazy nft__item_preview"
                        alt={`${authorItem.title} NFT`}
                      />
                    </Link>
                  </div>

                  <div className="nft__item_info">
                    <Link to={itemRoute}>
                      <h4>{authorItem.title}</h4>
                    </Link>
                    {authorItem.price != null && (
                      <div className="nft__item_price">
                        {Number(authorItem.price).toFixed(2)} ETH
                      </div>
                    )}
                    <div className="nft__item_like">
                      <i className="fa fa-heart"></i>
                      <span>{authorItem.likes}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AuthorItems;
