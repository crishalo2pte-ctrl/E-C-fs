"use client"

import Link from "next/link"
import { ShoppingCart, Trash2, Heart } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useFavorites } from "@/hooks/use-favorites"
import { fetcher } from "@/lib/api"
import { formatARS } from "@/lib/format"
import { FavoritesSkeleton, Skeleton } from "@/components/skeletons"

export default function FavoritesPage() {
  const { favorites, isLoading, mutate } = useFavorites()

  const removeFavorite = async (id: string) => {
    await fetcher(`/api/favorites/${id}`, { method: "DELETE" })
    mutate()
  }

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64" />
        <FavoritesSkeleton />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Favoritos</h1>
        <p className="text-muted-foreground">Tus productos guardados</p>
      </div>

      {favorites.length === 0 ? (
        <Card className="border-0 shadow-sm">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Heart className="h-12 w-12 text-muted-foreground/30 mb-4" />
            <p className="text-lg font-medium">No tienes favoritos</p>
            <p className="text-sm text-muted-foreground mb-4">Guarda productos que te gusten para encontrarlos fácilmente</p>
            <Button asChild className="rounded-full">
              <Link href="/catalogo">Explorar Catálogo</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {favorites.map((fav) => (
            <Card key={fav.id} className="group border-0 shadow-sm overflow-hidden transition-shadow hover:shadow-md">
              <div className="relative aspect-[4/3] bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                <span className="text-5xl font-bold text-primary/20">{fav.name.charAt(0)}</span>
                {!fav.inStock && (
                  <Badge variant="destructive" className="absolute top-3 left-3 rounded-full text-[10px]">
                    Agotado
                  </Badge>
                )}
              </div>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground mb-1">{fav.category}</p>
                <Link href={`/producto/${fav.slug}`} className="font-semibold text-sm hover:text-primary transition-colors">
                  {fav.name}
                </Link>
                <p className="mt-1 font-bold text-primary">{formatARS(fav.price)}</p>
                <div className="mt-3 flex gap-2">
                  <Button
                    size="sm"
                    className="flex-1 rounded-full"
                    disabled={!fav.inStock}
                  >
                    <ShoppingCart className="mr-1 h-3.5 w-3.5" />
                    {fav.inStock ? "Agregar" : "Agotado"}
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="icon" variant="outline" className="h-8 w-8 rounded-full text-destructive">
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>¿Eliminar de favoritos?</AlertDialogTitle>
                        <AlertDialogDescription>
                          {fav.name} será eliminado de tu lista de favoritos.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => removeFavorite(fav.id)}>
                          Eliminar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
