

echo "🚀 Starting AP Backend..."


set -e


if [ ! -d "node_modules" ]; then
  echo "📦 Installing dependencies..."
  npm install
fi


if [ -f .env ]; then
  echo "🔐 Loading environment variables from .env"
  export $(grep -v '^#' .env | xargs)
fi
npx prisma generate

echo "🌱 Seeding database..."
npx prisma db seed

echo "🔥 Starting server..."
npm run server
