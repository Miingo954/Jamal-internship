import React from "react";
import NftItem from "../UI/NftItem";

const AuthorItems = ({ author }) => (
  <div className="de_tab_content" key={author.authorId}>
    <div className="tab-1">
      <div className="row">
        {author.nftCollection.length === 0 && (
          <div className="col-12 text-center">
            <p>This creator has no listed work right now.</p>
          </div>
        )}

        {author.nftCollection.map((item) => (
          <div className="col-lg-3 col-md-6 col-sm-6 col-xs-12" key={item.id}>
            <NftItem
              item={item}
              itemPath={`/item-details/author/${author.authorId}/${item.id}`}
              showAuthor={false}
            />
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default AuthorItems;
