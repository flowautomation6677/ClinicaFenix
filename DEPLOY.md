# 🚀 Guia de Deploy - Site Clínica Fenix

## Pré-requisitos

- Servidor web (Apache, Nginx, ou similar)
- Suporte a HTML5, CSS3 e JavaScript
- HTTPS configurado (recomendado)

## Passos para Deploy

### 1. Preparação dos Arquivos

Certifique-se de que todos os arquivos estão compilados:

```bash
# Compilar SCSS para CSS minificado
sass scss/main.scss css/main.min.css --style=compressed
```

### 2. Arquivos Necessários

Faça upload dos seguintes arquivos e pastas para o servidor:

```
- index.html
- especialidades.html
- medicina-ocupacional.html
- exames.html
- convenios.html
- clinicas-conveniadas.html
- contato.html
- css/ (pasta completa)
- js/ (pasta completa)
- img/ (pasta completa)
```

**Nota**: Não é necessário fazer upload da pasta `scss/` em produção.

### 3. Configurações do Servidor

#### Apache (.htaccess)

Crie um arquivo `.htaccess` na raiz do site:

```apache
# Habilitar compressão GZIP
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript
</IfModule>

# Cache de arquivos estáticos
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType text/css "access plus 1 month"
    ExpiresByType application/javascript "access plus 1 month"
</IfModule>

# Redirecionar para HTTPS
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Remover .html da URL
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^([^\.]+)$ $1.html [NC,L]
```

#### Nginx

Adicione ao arquivo de configuração do site:

```nginx
# Compressão GZIP
gzip on;
gzip_types text/plain text/css application/json application/javascript text/xml application/xml;

# Cache de arquivos estáticos
location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}

# Redirecionar para HTTPS
if ($scheme != "https") {
    return 301 https://$server_name$request_uri;
}
```

### 4. Configurações Importantes

#### Atualizar Informações de Contato

Edite os seguintes arquivos e atualize:

1. **Todas as páginas HTML**: 
   - Número de telefone: `(21) 99999-9999`
   - WhatsApp: `5521999999999`
   - E-mail: `contato@clinicafenix.com.br`

2. **js/main.js**:
   - Linha do WhatsApp no formulário de contato

#### Integrar Formulário de Contato

O formulário atual é apenas frontend. Para produção, integre com:

- **Backend PHP**: Criar arquivo `send-email.php`
- **Serviço de E-mail**: SendGrid, Mailgun, etc.
- **Google Forms**: Alternativa simples

### 5. Otimizações Pós-Deploy

#### Google Analytics

Adicione antes do `</head>` em todas as páginas:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

#### Google Search Console

1. Acesse [Google Search Console](https://search.google.com/search-console)
2. Adicione a propriedade do site
3. Verifique a propriedade
4. Envie o sitemap

#### Criar Sitemap

Crie `sitemap.xml` na raiz:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://www.clinicafenix.com.br/</loc>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://www.clinicafenix.com.br/especialidades</loc>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://www.clinicafenix.com.br/medicina-ocupacional</loc>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://www.clinicafenix.com.br/exames</loc>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://www.clinicafenix.com.br/convenios</loc>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://www.clinicafenix.com.br/clinicas-conveniadas</loc>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://www.clinicafenix.com.br/contato</loc>
    <priority>0.7</priority>
  </url>
</urlset>
```

### 6. Testes Pós-Deploy

- [ ] Testar todas as páginas
- [ ] Verificar responsividade em mobile
- [ ] Testar formulário de contato
- [ ] Verificar links do WhatsApp
- [ ] Testar velocidade (PageSpeed Insights)
- [ ] Verificar SEO (Google Search Console)
- [ ] Testar em diferentes navegadores

### 7. Manutenção

- Atualizar conteúdo regularmente
- Monitorar performance
- Verificar links quebrados
- Atualizar informações de contato quando necessário
- Fazer backup regular dos arquivos

## Suporte

Para dúvidas sobre o deploy, consulte a documentação do seu provedor de hospedagem.
