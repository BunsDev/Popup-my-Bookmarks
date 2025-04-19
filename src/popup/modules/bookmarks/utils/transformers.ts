import { ROOT_ID } from '@/core/constants/index.js'
import folderIcon from '@/popup/images/folder.svg'

import { BOOKMARK_TYPES, SEPARATE_THIS_URL } from '../constants.js'
import type { BookmarkInfo } from '../types.js'
import { faviconUrl } from './faviconUrl.js'

function getType(bookmarkNode: Readonly<browser.bookmarks.BookmarkTreeNode>) {
  if (bookmarkNode.url == null) return BOOKMARK_TYPES.FOLDER
  if (bookmarkNode.url.startsWith(SEPARATE_THIS_URL)) {
    return BOOKMARK_TYPES.SEPARATOR
  }
  return BOOKMARK_TYPES.BOOKMARK
}

function isRoot(
  bookmarkNode: Readonly<browser.bookmarks.BookmarkTreeNode>,
): boolean {
  return bookmarkNode.id === ROOT_ID || bookmarkNode.parentId === ROOT_ID
}

export function toBookmarkInfo(
  bookmarkNode: Readonly<browser.bookmarks.BookmarkTreeNode>,
) {
  const bookmarkInfo = {
    id: bookmarkNode.id,
    isRoot: isRoot(bookmarkNode),
    isSimulated: false,
    isUnmodifiable: isRoot(bookmarkNode) || Boolean(bookmarkNode.unmodifiable),
    parentId: bookmarkNode.parentId,
    storageIndex:
      typeof bookmarkNode.index === 'number' ? bookmarkNode.index : -1,
    title: bookmarkNode.title,
  } as const satisfies Partial<BookmarkInfo>

  const type = getType(bookmarkNode)
  switch (type) {
    case BOOKMARK_TYPES.BOOKMARK:
      return {
        ...bookmarkInfo,
        type,
        iconUrl: faviconUrl(bookmarkNode.url!),
        url: bookmarkNode.url!,
      } as const satisfies BookmarkInfo

    case BOOKMARK_TYPES.FOLDER:
      return {
        ...bookmarkInfo,
        type,
        iconUrl: folderIcon,
      } as const satisfies BookmarkInfo

    case BOOKMARK_TYPES.SEPARATOR:
      return {
        ...bookmarkInfo,
        type,
        url: bookmarkNode.url!,
      } as const satisfies BookmarkInfo
  }
}
