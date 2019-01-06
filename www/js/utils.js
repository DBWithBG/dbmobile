export function mimeTypeFromExtension(file_ext) {
    switch (file_ext) {
        case "pdf":
            return "application/pdf";
        case "jpg":
            return "image/jpeg";
        case "jpeg":
            return "image/jpeg";
        case "png":
            return "image/pgn";
    }
}