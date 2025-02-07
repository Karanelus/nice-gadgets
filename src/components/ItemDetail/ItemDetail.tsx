/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import Heart from "../../assets/icons/Heart";
import ItemDetailImages from "./ItemDetailImages";
import ItemDetailColors from "./ItemDetailColors";
import ItemDetailCapacity from "./ItemDetailCapacity";
import { useQuery } from "@tanstack/react-query";
import { getItem } from "../../api/api";

type Specs = { name: string; option: string | string[] | undefined };

const ItemDetail = () => {
  const {
    shoppingCart,
    favorite,
    colors,
    handleAddFavoriteItem,
    handleRemoveFavoriteItem,
    handleAddProductShop,
    handleRemoveProductShop,
    productsList,
  } = useAppContext();
  const { primary, secAccent } = colors;
  const { idItem } = useParams();
  const navigate = useNavigate();
  const productType = useLocation().pathname.split("/")[1];
  const [chosenImage, setChosenImage] = useState<number>(0);
  const { data, isLoading } = useQuery({
    queryFn: () => getItem(productType, idItem!),
    queryKey: ["item", productType, idItem],
    enabled: !!idItem,
  });
  const { itemInfo, categoryList } = data ?? {};
  const findItem = productsList.find((item) => item.itemId === itemInfo?.id);

  console.log("Fetched data:", data);

  const isInShoppingCart = shoppingCart.find(
    (el) => el.itemId === itemInfo?.id,
  );

  const isInFavorite = favorite.find((el) => el.itemId === itemInfo?.id);

  const mainSpecs: Specs[] = [
    { name: "Screen", option: itemInfo?.screen },
    { name: "Resolution", option: itemInfo?.resolution },
    { name: "Processor", option: itemInfo?.processor },
    { name: "RAM", option: itemInfo?.ram },
  ];

  const fullSpecs: Specs[] = [
    { name: "Screen", option: itemInfo?.screen },
    { name: "Resolution", option: itemInfo?.resolution },
    { name: "Processor", option: itemInfo?.processor },
    { name: "RAM", option: itemInfo?.ram },
    { name: "Built in memory", option: itemInfo?.capacity },
    { name: "Camera", option: itemInfo?.camera },
    { name: "Zoom", option: itemInfo?.zoom },
    { name: "Cell", option: itemInfo?.cell },
  ];

  useEffect(() => {
    setChosenImage(0);
  }, []);

  const handleClickChangePhoto = (i: number) => {
    setChosenImage(i);
  };

  const handleClickChangeColor = (color: string) => {
    const newItem = categoryList?.find(
      (item) =>
        item.color === color &&
        itemInfo?.namespaceId === item.namespaceId &&
        item.capacity === itemInfo.capacity,
    );

    if (newItem) {
      navigate(`/${productType}/${newItem.id}`);
    }
  };

  const handleClickChangeCapacity = (capacity: string) => {
    const newItem = categoryList?.find(
      (item) =>
        item.capacity === capacity &&
        itemInfo?.namespaceId === item.namespaceId &&
        item.color === itemInfo.color,
    );

    if (newItem) {
      navigate(`/${productType}/${newItem.id}`);
    }
  };

  useEffect(() => {
    if (itemInfo && itemInfo.id !== idItem) {
      navigate(`/${productType}/${itemInfo.id}`);
    }
  }, [itemInfo, idItem, navigate, productType]);

  const handleClickFavorite = () => {
    if (findItem) {
      return isInFavorite
        ? handleRemoveFavoriteItem(findItem.id)
        : handleAddFavoriteItem(findItem);
    }

    return;
  };
  1;

  const handleClickShop = () => {
    if (findItem) {
      return isInShoppingCart
        ? handleRemoveProductShop(findItem.id)
        : handleAddProductShop(findItem);
    }

    return;
  };

  if (isLoading) {
    return <h2>Loading...</h2>;
  }

  if (!itemInfo) {
    return <h2>Item not found</h2>;
  }

  return (
    <section className="mb-20 flex w-full flex-col gap-20 pt-6 small:pt-8 desktop:pt-16">
      <h2>{itemInfo?.name}</h2>
      <section className="grid gap-10 small:grid-cols-[auto,auto] small:gap-4">
        {itemInfo && (
          <ItemDetailImages
            currentImage={itemInfo.images[chosenImage]!}
            images={itemInfo.images}
            chosenImage={chosenImage}
            onClick={handleClickChangePhoto}
          />
        )}
        <div>
          {itemInfo && (
            <>
              <ItemDetailColors
                item={itemInfo}
                colors={itemInfo.colorsAvailable.sort()}
                onClick={handleClickChangeColor}
              />
              <hr className="my-6 border-elem"></hr>
              <ItemDetailCapacity
                item={itemInfo}
                capacities={itemInfo.capacityAvailable}
                onClick={handleClickChangeCapacity}
              />
              <hr className="my-6 border-elem"></hr>
            </>
          )}

          <div className="flex flex-col gap-8">
            <section className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <h2>${itemInfo?.priceDiscount}</h2>
                <h3 className="text-sec line-through">
                  ${itemInfo?.priceRegular}
                </h3>
              </div>
              <div className="grid w-full grid-cols-[1fr_auto] justify-between gap-2">
                <button
                  onClick={handleClickShop}
                  className={`h-10 rounded-lg text-bodyText duration-300 hover:shadow-buttonHover ${isInShoppingCart ? "border-1 border-elem bg-white text-accent" : "bg-accent text-white"}`}
                >
                  {isInShoppingCart ? "Added to cart" : "Add to cart"}
                </button>
                <button
                  onClick={handleClickFavorite}
                  className="grid aspect-square h-10 place-items-center rounded-full border-1 border-icon duration-300 hover:border-primary"
                >
                  <Heart
                    fill={!isInFavorite ? primary : secAccent}
                    isFilled={!!isInFavorite}
                  />
                </button>
              </div>
            </section>
            <section className="flex flex-col gap-2">
              {itemInfo &&
                mainSpecs.map((spec) => (
                  <div className="flex justify-between" key={spec.name}>
                    <p className="text-smallText text-sec">{spec.name}</p>
                    <p className="text-smallText">{spec.option}</p>
                  </div>
                ))}
            </section>
          </div>
        </div>
      </section>
      <section className="grid grid-cols-1 gap-14 small:gap-16 desktop:grid-cols-2">
        <div>
          <h3>About</h3>
          <hr className="my-6 border-elem"></hr>
          <section className="grid gap-8">
            {itemInfo?.description.map((text) => (
              <article className="flex flex-col gap-4" key={text.title}>
                <h4 key={text.title}>{text.title}</h4>
                <p className="text-bodyText text-sec">{text.text}</p>
              </article>
            ))}
          </section>
        </div>
        <div>
          <h3>Tech specs</h3>
          <hr className="my-6 border-elem"></hr>
          <section className="grid gap-2">
            {itemInfo &&
              fullSpecs.map((spec) =>
                spec.option ? (
                  <div className="flex justify-between" key={spec.name}>
                    <p className="text-bodyText text-sec">{spec.name}</p>
                    <p className="text-bodyText">
                      {Array.isArray(spec.option)
                        ? spec.option.join(", ")
                        : spec.option}
                    </p>
                  </div>
                ) : (
                  <></>
                ),
              )}
          </section>
        </div>
      </section>
    </section>
  );
};

export default ItemDetail;
