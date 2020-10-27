<template>
  <footer class="footer px-4">
    <div class="row align-items-center justify-content-lg-between">
      <div class="col-lg-6">
        <div class="copyright text-center text-lg-left text-muted">
          © {{year}} <a href="http://syswa.net" class="font-weight-bold ml-1" target="_blank">SYSWA</a> 
          
        </div>
      </div>
      <div class="col-lg-6">
        <ul class="nav nav-footer justify-content-center justify-content-lg-end">
          <li class="nav-item">
            <a href="http://syswa.net" class="nav-link" target="_blank">SYSWA</a>
          </li>
          <li class="nav-item">
            <a href="http://syswa.net/nosotros" class="nav-link" target="_blank">Nosotros</a>
          </li>
          
        </ul>
      </div>
    </div>
  </footer>
</template>
<script>
export default {
  data() {
    return {
      year: new Date().getFullYear()
    };
  }
};
</script>
<style></style>
