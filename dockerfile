FROM node:20.12.0-alpine3.19

WORKDIR /usr/src/app

COPY package*.json ./
COPY tsconfig.json ./



# Install dependencies
RUN npm install



COPY src ./src 
COPY prisma ./prisma 
COPY server ./server 


# Can you add a script to the global package.json that does this?
RUN  npx prisma generate


COPY . .

RUN npm run build

# Expose the port your application will run on
EXPOSE 3000
CMD ["npm", "run" , "start"]