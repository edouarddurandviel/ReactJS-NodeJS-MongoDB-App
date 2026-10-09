Here’s a **practical step-by-step guide** to install MongoDB on an
Amazon EC2 instance in Amazon Web Services.

---

# 🧱 1. Launch EC2 Instance

Choose:

- AMI: **Ubuntu 22.04** (recommended)
- Instance: `t3.micro` (free tier ok)
- Storage: 10–20 GB

### Security Group:

- SSH (22) → your IP
- MongoDB (27017) → ⚠️ **ONLY your IP (never 0.0.0.0/0)**

---

# 🔌 2. Connect to EC2

```bash
ssh ubuntu@<your-ec2-ip>
```

---

# 📦 3. Install MongoDB

## Import key + repo

```bash
sudo apt-get update
sudo apt-get install -y gnupg curl

curl -fsSL https://pgp.mongodb.com/server-7.0.asc | \
  sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg \
  --dearmor

echo "deb [ signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] \
https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | \
sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
```

---

## Install packages

```bash
sudo apt-get update
sudo apt-get install -y mongodb-org
```

---

# ▶️ 4. Start MongoDB

```bash
sudo systemctl start mongod
sudo systemctl enable mongod
```

Check:

```bash
sudo systemctl status mongod
```

---

# 🔐 5. Secure MongoDB (IMPORTANT)

## Open Mongo shell

```bash
mongosh
```

---

## Create admin user

```javascript
use admin

db.createUser({
  user: "admin",
  pwd: "strongpassword",
  roles: [ { role: "root", db: "admin" } ]
})
```

---

## Enable authentication

Edit config:

```bash
sudo nano /etc/mongod.conf
```

Find and enable:

```yaml
security:
  authorization: enabled
```

---

Restart:

```bash
sudo systemctl restart mongod
```

---

# 🌐 6. Allow Remote Access (Optional)

Edit config:

```bash
sudo nano /etc/mongod.conf
```

Change:

```yaml
bindIp: 127.0.0.1
```

➡️ to:

```yaml
bindIp: 0.0.0.0
```

⚠️ Only do this if:

- Security group is locked down to your IP

---

# 🔗 7. Connect Remotely

Using Mongo shell:

```bash
mongosh "mongodb://admin:strongpassword@<ec2-ip>:27017"
```

---

# 🔐 🔥 Better (Production) Access Pattern

Instead of opening port 27017:

👉 Use **AWS Systems Manager Session Manager**

### Port forward:

```bash
aws ssm start-session \
  --target <instance-id> \
  --document-name AWS-StartPortForwardingSession \
  --parameters '{"portNumber":["27017"],"localPortNumber":["27017"]}'
```

Then connect locally:

```bash
mongosh mongodb://admin:password@localhost:27017
```

✅ No public DB port
✅ No SSH needed
✅ Much safer

---

# 💸 Cost Estimate

- EC2 t3.micro → ~$5–10/month
- Storage → small
- MongoDB → free (self-hosted)

---

# ⚠️ Common Mistakes

- ❌ Opening MongoDB to the internet
- ❌ No authentication enabled
- ❌ No backups
- ❌ Running single instance (no replica set)

---

# 🧠 Mental Model

👉 EC2 + MongoDB =
**you are the DBA + DevOps**

---

# ⚡ Recommendation

- Learning / small project → ✅ this setup
- Production → ❌ consider:

  - MongoDB Atlas

---

If you want next:

- Set up **MongoDB replica set on EC2**
- Automate with **CloudFormation / Terraform**
- Or connect MongoDB to your **EKS / Node.js app**

Just tell me 👍
