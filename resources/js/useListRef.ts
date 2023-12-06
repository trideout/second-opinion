import { useRef, useEffect } from 'react';

export type ListRef<E extends HTMLElement> = [
  /**
   * A stable reference to the array of elements that has been collected.
   */
  elements: ReturnType<typeof useRef<E[]>>,
  /**
   * A callback ref that can capture elements rendered by `.map()`
   * and store them in the `elements` reference.
   *
   * Docs on callback refs:
   * https://beta.reactjs.org/learn/manipulating-the-dom-with-refs#how-to-manage-a-list-of-refs-using-a-ref-callback
   *
   * Example usage: `myArray.map((item) => <div key={item} ref={callbackRef} />)`
   */
  callbackRef: (element: E) => void,
  /**
   * A stable reference to an object that describes the status of `elements`.
   * Primarily used for performance optimizations (e.g. not removing and
   * re-adding event listeners until the array of elements has actually changed).
   */
  status: ReturnType<typeof useRef<ListRefStatus>>
]

export interface ListRefStatus {
  length: 'none' | 'lengthened' | 'shortened';
  order: 'none' | 'changed';
}

/**
 * `useListRef` is designed to capture rendered lists of React elements.
 * It uses a callback ref to collect elements, which we can access from
 * other hooks to assign attributes or properties, add event listeners, connect
 * observers, etc.
 *
 * Note that in React, any rendered list can potentially change length or order
 * on any component update. When that happens, hooks need to reassign attributes,
 * clean up & re-add event listeners, etc. To help us with that, `useListRef`
 * analyzes the list of elements on every update to check whether or not its
 * length or order has changed. This check is fast, and if it determines that
 * length and order have not changed, then we can skip the expensive work of
 * re-adding event listeners, etc.
 */
export default function useListRef<E extends HTMLElement>(): ListRef<E> {
  const elements = useRef<E[]>([]);
  const previousElements = useRef<E[]>([]);
  const status = useRef<ListRefStatus>({ length: 'none', order: 'none' });

  const callbackRef = (el: E) => {
    if (el) {
      if (shouldEmptyElements.current) {
        elements.current = [];
        shouldEmptyElements.current = false;
      }

      elements.current.push(el);
    }
  };

  const shouldEmptyElements = useRef(true);
  // Elements array gets emptied on every render, and callback ref refills it.
  shouldEmptyElements.current = true;

  useEffect(() => {
    const length = (() => {
      if (elements.current.length > previousElements.current.length) {
        return 'lengthened';
      }

      if (elements.current.length < previousElements.current.length) {
        return 'shortened';
      }

      return 'none';
    })();

    const order = (() => {
      for (let i = 0; i < elements.current.length; i += 1) {
        if (!elements.current[i] || !previousElements.current[i]) {
          continue; // eslint-disable-line no-continue
        }

        if (elements.current[i] !== previousElements.current[i]) {
          return 'changed';
        }
      }

      return 'none';
    })();

    status.current = { length, order };
    previousElements.current = [...elements.current];
  });

  return [
    elements,
    callbackRef,
    status,
  ];
}
