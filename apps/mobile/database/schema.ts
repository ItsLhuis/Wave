import { relations, sql } from "drizzle-orm"
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core"

// Songs
export const songs = sqliteTable(
  "songs",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    name: text("name").unique().notNull(),
    thumbnail: text("thumbnail"),
    duration: integer("duration").notNull(),
    isFavorite: integer("is_favorite", { mode: "boolean" }).notNull().default(false),
    releaseYear: integer("release_year"),
    albumId: integer("album_id").references(() => albums.id),
    createdAt: text("created_at")
      .notNull()
      .default(sql`(current_timestamp)`)
  },
  (table) => [index("songs_name_idx").on(table.name), index("songs_albumId_idx").on(table.albumId)]
)
export const songsRelations = relations(songs, ({ one, many }) => ({
  album: one(albums, {
    fields: [songs.albumId],
    references: [albums.id]
  }),
  artists: many(songsToArtists),
  playlists: many(playlistsToSongs)
}))

// Artists
export const artists = sqliteTable(
  "artists",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    name: text("name").unique().notNull(),
    thumbnail: text("thumbnail"),
    createdAt: text("created_at")
      .notNull()
      .default(sql`(current_timestamp)`)
  },
  (table) => [index("artists_name_idx").on(table.name)]
)
export const artistsRelations = relations(artists, ({ many }) => ({
  songs: many(songsToArtists)
}))

// Playlists
export const playlists = sqliteTable(
  "playlists",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    name: text("name").unique().notNull(),
    thumbnail: text("thumbnail"),
    createdAt: text("created_at")
      .notNull()
      .default(sql`(current_timestamp)`)
  },
  (table) => [index("playlists_name_idx").on(table.name)]
)
export const playlistsRelations = relations(playlists, ({ many }) => ({
  songs: many(playlistsToSongs)
}))

// Albums
export const albums = sqliteTable(
  "albums",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    name: text("name").unique().notNull(),
    thumbnail: text("thumbnail"),
    createdAt: text("created_at")
      .notNull()
      .default(sql`(current_timestamp)`)
  },
  (table) => [index("albums_name_idx").on(table.name)]
)

// Songs to Artists
export const songsToArtists = sqliteTable(
  "song_artists",
  {
    songId: integer("song_id")
      .notNull()
      .references(() => songs.id),
    artistId: integer("artist_id")
      .notNull()
      .references(() => artists.id)
  },
  (table) => [
    index("song_artists_songId_idx").on(table.songId),
    index("song_artists_artistId_idx").on(table.artistId)
  ]
)
export const songsToArtistsRelations = relations(songsToArtists, ({ one }) => ({
  song: one(songs, {
    fields: [songsToArtists.songId],
    references: [songs.id]
  }),
  artist: one(artists, {
    fields: [songsToArtists.artistId],
    references: [artists.id]
  })
}))

// Playlists to Songs
export const playlistsToSongs = sqliteTable(
  "playlist_songs",
  {
    playlistId: integer("playlist_id")
      .notNull()
      .references(() => playlists.id),
    songId: integer("song_id")
      .notNull()
      .references(() => songs.id)
  },
  (table) => [
    index("playlist_songs_playlistId_idx").on(table.playlistId),
    index("playlist_songs_songId_idx").on(table.songId)
  ]
)
export const playlistsToSongsRelations = relations(playlistsToSongs, ({ one }) => ({
  playlist: one(playlists, {
    fields: [playlistsToSongs.playlistId],
    references: [playlists.id]
  }),
  song: one(songs, {
    fields: [playlistsToSongs.songId],
    references: [songs.id]
  })
}))
