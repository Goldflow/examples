import { Link, useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import { getDirectusClient } from "~/lib/directus";
import MoreArticles from "~/components/MoreArticles";
import IconBack from "~/components/icons/Back";
import IconLink from "~/components/icons/Link";
import IconGithub from "~/components/icons/Github";
import IconYoutube from "~/components/icons/Youtube";
import IconLinkedin from "~/components/icons/Linkedin";
import IconTwitter from "~/components/icons/Twitter";
import { formatRelativeTime } from "../../../../shared/utils/format-relative-time";
import { getAssetURL } from "~/utils/get-asset-url";

export const loader = async ({ params }) => {
  const { id } = params;

  const directus = await getDirectusClient();

  const article = await directus.items("articles").readOne(id, {
    fields: ["*", "author.avatar", "author.first_name", "author.last_name"],
  });

  const formattedArticle = {
    ...article,
    publish_date: formatRelativeTime(new Date(article.publish_date)),
  };

  const moreArticlesResponse = await directus.items("articles").readMany({
    fields: ["*", "author.avatar", "author.first_name", "author.last_name"],
    filter: {
      _and: [{ id: { _neq: article.id } }, { status: { _eq: "published" } }],
    },
    limit: 2,
  });
  const formattedMoreArticles = moreArticlesResponse.data.map((moreArticle) => {
    return {
      ...moreArticle,
      publish_date: formatRelativeTime(new Date(moreArticle.publish_date)),
    };
  });

  return json({
    article: formattedArticle,
    moreArticles: formattedMoreArticles,
  });
};

export default function ArticlePage() {
  const data = useLoaderData();

  return (
    <div className="current-article">
      <section>
        <div className="container">
          <Link to="/" className="current-article__backlink">
            <IconBack className="icon" />
            <span>Back to Articles</span>
          </Link>
          <h1 className="current-article__title">{data.article.title}</h1>
          <div className="current-article__detail">
            <div className="current-article__wrapperOuter">
              <div className="current-article__wrapperInner">
                <div className="current-article__authorImage">
                  <img
                    src={getAssetURL(data.article.author.avatar)}
                    alt=""
                    loading="lazy"
                  />
                </div>
                <div>
                  <div className="current-article__authorName">
                    {`${data.article.author.first_name} ${data.article.author.last_name}`}
                  </div>
                  <div className="current-article__time">
                    {data.article.publish_date}
                  </div>
                </div>
              </div>
              <ul className="current-article__socials">
                <li>
                  <a
                    href={`/articles/${data.article.id}`}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    <IconLink />
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.youtube.com/c/DirectusVideos"
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    <IconYoutube />
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.linkedin.com/company/directus-io"
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    <IconLinkedin />
                  </a>
                </li>
                <li>
                  <a
                    href="https://twitter.com/directus"
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    <IconTwitter />
                  </a>
                </li>
              </ul>
            </div>
            <div className="current-article_coverImage">
              <img src={getAssetURL(data.article.cover_image)} alt="" />
            </div>
          </div>
          <div className="current-article__body">
            <div
              className="current-article__bodyContent"
              dangerouslySetInnerHTML={{ __html: data.article.body }}
            ></div>
            <ul className="current-article__bodySocials">
              <li>
                <a
                  href="https://github.com/directus"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  <IconGithub />
                </a>
              </li>
              <li>
                <a
                  href="https://www.youtube.com/c/DirectusVideos"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  <IconYoutube />
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/company/directus-io"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  <IconLinkedin />
                </a>
              </li>
              <li>
                <a
                  href="https://twitter.com/directus"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  <IconTwitter />
                </a>
              </li>
            </ul>
          </div>
        </div>
      </section>
      <MoreArticles articles={data.moreArticles} />
    </div>
  );
}
