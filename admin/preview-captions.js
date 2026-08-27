(() => {
  const captionClass = 'cms-image-title';
  const observedFrames = new WeakMap();
  const watchedFrames = new WeakSet();

  const normalizeImageSrc = image => {
    const source = (image.getAttribute('src') || '').replace(/\\/g, '/');
    let pathname = source;
    try {
      pathname = new URL(source, image.ownerDocument.baseURI).pathname;
    } catch (_error) {
      // The original source below is still enough for normal relative paths.
    }
    const staticMedia = source.match(/^(?:\/)?static\/images\/blog\/(.+)$/i);
    const nestedStaticMedia = pathname.match(/^\/preview\/[^/]+\/static\/images\/blog\/(.+)$/i);
    const match = staticMedia || nestedStaticMedia;
    if (match) image.setAttribute('src', `/images/blog/${match[1]}`);
  };

  const syncImageCaption = image => {
    normalizeImageSrc(image);
    const title = (image.getAttribute('title') || '').trim();
    const nextElement = image.nextElementSibling;
    const currentCaption = nextElement?.classList.contains(captionClass)
      ? nextElement
      : null;

    if (!title) {
      currentCaption?.remove();
      return;
    }

    const caption = currentCaption || image.ownerDocument.createElement('span');
    if (!currentCaption) {
      caption.className = captionClass;
      caption.setAttribute('role', 'note');
      image.insertAdjacentElement('afterend', caption);
    }

    if (caption.textContent !== title) {
      caption.textContent = title;
    }
  };

  const syncDocument = documentRef => {
    documentRef.querySelectorAll('img').forEach(syncImageCaption);
  };

  const observeFrame = frame => {
    try {
      const documentRef = frame.contentDocument;
      if (!documentRef?.documentElement) return;

      const previous = observedFrames.get(frame);
      if (previous?.documentRef === documentRef) {
        syncDocument(documentRef);
        return;
      }

      previous?.observer.disconnect();
      syncDocument(documentRef);

      const observer = new MutationObserver(() => syncDocument(documentRef));
      observer.observe(documentRef.documentElement, {
        attributes: true,
        attributeFilter: ['src', 'title'],
        childList: true,
        subtree: true,
      });
      observedFrames.set(frame, { documentRef, observer });
    } catch (_error) {
      // Ignore non-preview or cross-origin frames.
    }
  };

  const scanPreviewFrames = () => {
    document.querySelectorAll('iframe').forEach(frame => {
      if (!watchedFrames.has(frame)) {
        frame.addEventListener('load', () => observeFrame(frame));
        watchedFrames.add(frame);
      }
      observeFrame(frame);
    });
  };

  new MutationObserver(scanPreviewFrames).observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
  scanPreviewFrames();
})();
