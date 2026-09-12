import React from "react";
import { Link } from "react-router-dom";
import Countdown from "./Countdown";

const NftItem = ({ item, source = "new", itemPath, showAuthor = true }) => {
  const detailsPath = itemPath || `/item-details/${source}/${item.id}`;

  return (
    <div className="nft__item">
      {showAuthor && (
        <div className="author_list_pp">
          <Link
            to={`/author/${item.authorId}`}
            data-bs-toggle="tooltip"
            data-bs-placement="top"
            title={`Creator #${item.authorId}`}
          >
            <img
              className="lazy"
              src={item.authorImage}
              alt={`Creator of ${item.title}`}
              loading="lazy"
            />
            <i className="fa fa-check"></i>
          </Link>
        </div>
      )}

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

        <Link to={detailsPath}>
          <img
            src={item.nftImage}
            className="lazy nft__item_preview"
            alt={`${item.title} NFT`}
            loading="lazy"
          />
        </Link>
      </div>

      <div className="nft__item_info">
        <Link to={detailsPath}>
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
  );
};

export default NftItem;
