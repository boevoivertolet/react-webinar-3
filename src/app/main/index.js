import {memo, useCallback, useEffect} from 'react';
import Item from "../../components/item";
import PageLayout from "../../components/page-layout";
import Head from "../../components/head";
import BasketTool from "../../components/basket-tool";
import List from "../../components/list";
import useStore from "../../store/use-store";
import useSelector from "../../store/use-selector";
import Pagination from "../../components/pagination";

function Main() {

  const store = useStore();

  const select = useSelector(state => ({
    lang: state.lang,
    list: state.catalog.list,
    currentPage: state.catalog.currentPage,
    count: state.catalog.count,
    amount: state.basket.amount,
    sum: state.basket.sum,
  }));

  const callbacks = {
    // Добавление в корзину
    addToBasket: useCallback(_id => store.actions.basket.addToBasket(_id), [store]),
    // Открытие модалки корзины
    openModalBasket: useCallback(() => store.actions.modals.open('basket'), [store]),
    setCurrentPage: useCallback((pageNumber) => store.actions.catalog.setPage(pageNumber), [store]),
  }

  const renders = {
    item: useCallback((item) => {
      return <Item lang={select.lang} item={item} onAdd={callbacks.addToBasket}/>
    }, [callbacks.addToBasket, select.lang]),
  };

  useEffect(() => {
    store.actions.catalog.load();
  }, [select.currentPage, select.lang]);

  return (
    <PageLayout>
      <Head title={select.lang === 'ru-RU' ? 'Магазин' : 'Shop'}/>
      <BasketTool lang={select.lang} setCurrentPage={() => callbacks.setCurrentPage(1)}
                  onOpen={callbacks.openModalBasket} amount={select.amount}
                  sum={select.sum} currentPage={select.currentPage}/>
      <List list={select.list} renderItem={renders.item}/>
      <Pagination count={select.count} currentPage={select.currentPage} setCurrentPage={callbacks.setCurrentPage}/>
    </PageLayout>

  );
}

export default memo(Main);
