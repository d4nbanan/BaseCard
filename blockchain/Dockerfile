FROM node:22.9.0-alpine

WORKDIR /app

COPY . .

RUN npm ci

EXPOSE 8545

CMD ["npx", "hardhat", "node"]